// pages/edit/edit.js
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {},
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
})