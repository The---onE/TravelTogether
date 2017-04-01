// pages/details/details.js
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    user: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showNavigationBarLoading()
    var temp = AV.Object('Project')
    temp.set('title', '加载中……')
    this.setData({
      project: temp
    })
    var objectId = options.id
    var that = this
    // 获取用户数据
    AV.User.loginWithWeapp().then(user => {
      that.setData({
        user: user
      })
    }).catch(console.error)
    this.getProjectInfo(objectId);
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

        that.setData({ project: project })
      })
      .catch(console.error);
  },
  showPointInMap: function (e) {
    var p = e.target.dataset.point
    wx.openLocation({
      latitude: parseFloat(p.latitude), // 纬度，范围为-90~90，负数表示南纬
      longitude: parseFloat(p.longitude), // 经度，范围为-180~180，负数表示西经
      name: p.name ? p.name : '', // 位置名
      address: p.address ? p.address : '', // 地址的详细说明
    })
  }
})