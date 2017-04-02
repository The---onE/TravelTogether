// pages/details/details.js
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    user: null,
    availability: 'disable'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 加载成功前提示信息
    wx.showNavigationBarLoading()
    var temp = AV.Object('Project')
    temp.set('title', '加载中……')
    this.setData({
      project: temp
    })
    var that = this
    // 获取用户数据
    AV.User.loginWithWeapp().then(user => {
      var objectId = options.id
      that.setData({
        user: user,
        objectId: objectId
      })
      // 加载计划信息
      this.getProjectInfo(objectId)
    }).catch(console.error)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 加载计划信息
  getProjectInfo: function (objectId) {
    var that = this
    var query = new AV.Query('Project');
    query.get(objectId)
      .then(function (project) {
        wx.hideNavigationBarLoading()
        // 处理计划信息
        // 格式化时间
        var time = util.getDateString(project.get('startTime'), "yyyy-MM-dd hh:mm")
        project.set('time', time)
        // 获取当前实际人数
        var participant = project.get('participant')
        var count = participant.length
        project.set('actualPeople', count)

        // 根据创建者和参与者确定自己的权限
        var self = that.data.user.id
        var creater = project.get('creater')
        var availability = 'disable'
        if (self == creater) {
          // 自己是创建者
          availability = 'creater'
        } else if (participant.indexOf(self) > -1) {
          // 自己已加入计划
          availability = 'participant'
        } else {
          // 可以加入计划
          availability = 'able'
        }

        that.setData({
          project: project,
          availability: availability
        })
      })
      .catch(console.error);
  },
  // 在地图中显示
  showPointInMap: function (e) {
    var p = e.target.dataset.point
    wx.openLocation({
      latitude: parseFloat(p.latitude), // 纬度，范围为-90~90，负数表示南纬
      longitude: parseFloat(p.longitude), // 经度，范围为-180~180，负数表示西经
      name: p.name ? p.name : '', // 位置名
      address: p.address ? p.address : '', // 地址的详细说明
    })
  },
  // 确认是否删除
  askDeleteProject: function () {
    var that = this
    var project = this.data.project
    if (project.get('objectId')) {
      // 对参与者的判断
      var participant = project.get('participant')
      if (participant.length > 1) {
        wx.showModal({
          title: '失败',
          content: '已有其他人加入你的计划，无法删除',
          showCancel: false
        })
        return
      }
      wx.showModal({
        title: '删除',
        content: '您确认要删除该计划吗？',
        success: function (res) {
          if (res.confirm) {
            that.deleteProject()
          }
        }
      })
    }
  },
  // 删除计划
  deleteProject: function () {
    var project = this.data.project
    if (project.get('objectId')) {
      // 设置状态为已删除
      project.set('status', -1)
      project.save().then(function (p) {
        wx.showToast({
          title: '删除成功',
          mask: false,
          success: function () {
            wx.navigateBack();
          }
        })
      }, function (error) {
        console.error(error);
      });
    }
  },

  // 确认是否加入
  askJoinProject: function () {
    var that = this
    var project = this.data.project
    if (project.get('objectId')) {
      // 对参与者的判断
      var participant = project.get('participant')
      wx.showModal({
        title: '加入',
        content: '您确认要加入该计划吗？',
        success: function (res) {
          if (res.confirm) {
            that.joinProject()
          }
        }
      })
    }
  },
  // 加入计划
  joinProject: function () {
    var that = this
    var project = this.data.project
    if (project.get('objectId')) {
      var participant = project.get('participant')
      var self = this.data.user.id
      // 参与者中没有自己
      if (participant.indexOf(self) < 0) {
        // 将自己加入计划的参与者
        participant.push(self)
        project.save().then(function (p) {
          var extra = project.get('extra')
          wx.showModal({
            title: '加入成功',
            content: extra,
            showCancel: false,
            success: function () {
              var objectId = that.data.objectId
              that.getProjectInfo(objectId)
            }
          })
        }, function (error) {
          console.error(error);
        });
      }
    }
  },

  // 确认是否退出
  askQuitProject: function () {
    var that = this
    var project = this.data.project
    if (project.get('objectId')) {
      var participant = project.get('participant')
      var self = this.data.user.id
      // 确认自己是否是参与者
      if (participant.indexOf(self) < 0) {
        wx.showModal({
          title: '失败',
          content: '您尚未加入该计划',
          showCancel: false
        })
        return
      }
      wx.showModal({
        title: '退出',
        content: '您确认要退出该计划吗？',
        success: function (res) {
          if (res.confirm) {
            that.quitProject()
          }
        }
      })
    }
  },
  // 退出计划
  quitProject: function () {
    var that = this
    var project = this.data.project
    if (project.get('objectId')) {
      var participant = project.get('participant')
      console.info(participant)
      var self = this.data.user.id
      var index = participant.indexOf(self)
      // 参与者中包含自己
      if (index > -1) {
        // 通过截取拼接删除自己的元素
        var newParticipant = participant.slice(0, index).concat(participant.slice(index + 1, participant.length))
        // 设置计划为新的参与者列表
        project.set('participant', newParticipant)
        project.save().then(function (p) {
          wx.showToast({
            title: '退出成功',
            mask: false,
            success: function () {
              var objectId = that.data.objectId
              that.getProjectInfo(objectId)
            }
          })
        }, function (error) {
          console.error(error);
        });
      }
    }
  }
})