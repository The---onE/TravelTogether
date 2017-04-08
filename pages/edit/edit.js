// pages/edit/edit.js
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    showError: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showNavigationBarLoading()
    if (wx.showLoading) {
      wx.showLoading({
        title: '加载中'
      })
    }
    var objectId = options.id
    // 加载计划信息
    this.getProjectInfo(objectId)
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
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  // 加载计划信息
  getProjectInfo: function (objectId) {
    var that = this
    var query = new AV.Query('Project');
    query.get(objectId)
      .then(function (project) {
        wx.hideNavigationBarLoading()
        if (wx.hideLoading) {
          wx.hideLoading();
        }

        var date = util.getDateString(project.get('startTime'), "yyyy-MM-dd")
        var time = util.getDateString(project.get('startTime'), "hh:mm")

        that.setData({
          project: project,
          date: date,
          time: time
        })
      })
      .catch(console.error);
  },

  // 点击确定提交表单
  onSubmit: function (res) {
    var that = this
    this.setData({
      showError: false
    })
    // 获取要修改的计划
    var project = this.data.project
    var data = res.detail.value // 表单数据
    try {
      // 修改数据
      project.set('title', util.getInputNotEmpty(data.title, '标题不能为空'))

      project.set('srcTitle', util.getInputNotEmpty(data.srcTitle, '出发地不能为空'))
      project.set('desTitle', util.getInputNotEmpty(data.desTitle, '目的地不能为空'))

      var timeStr = that.data.date + ' ' + that.data.time
      var startTime = Date.parse(timeStr)
      if (!startTime) {
        throw '请选择出发时间'
      }
      var now = new Date()
      if (now > startTime) {
        throw '出发时间不能早于当前时间'
      }
      project.set('startTime', new Date(startTime)) // 出发时间

      project.set('duration', util.getInputNotEmpty(data.duration, '旅行时间不能为空'))
      project.set('expectedPeople', util.getInputNotEmpty(data.expectedPeople, '预期人数不能为空'))
      project.set('contact', util.getInputNotEmpty(data.contact, '联系方式不能为空'))
      project.set('extra', util.getInputNotEmpty(data.extra, '额外信息不能为空'))
      project.set('content', util.getInputNotEmpty(data.content, '详细信息不能为空'))

      wx.showToast({
        title: '提交中',
        icon: 'loading',
        duration: 2000,
        mask: true
      })
      // 提交计划
      project.save().then(function (p) {
        // 提交成功
        wx.showToast({
          title: '提交成功',
          icon: 'success',
        })
        // 关闭页面
        wx.navigateBack()
      }, function (error) {
        console.error(error);
      });
    } catch (e) {
      // 存在空值，提示错误信息
      that.setData({
        showError: true,
        errorInfo: e
      })
    }
  },

  // 选取出发点
  onChooseSourcePoint: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // 选取成功
        var project = that.data.project
        project.set('srcPoint', res)
        project.set('srcTitle', res.name)

        that.setData({
          project: project
        });
      }
    })
  },
  // 选取目的点
  onChooseDestinationPoint: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // 选取成功
        var project = that.data.project
        project.set('desPoint', res)
        project.set('desTitle', res.name)

        that.setData({
          project: project
        });
      }
    })
  },
  // 选取出发日期
  onDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 选取出发时间
  onTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
})