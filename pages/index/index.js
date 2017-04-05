//index.js

// 获取LeanCloud对象
const AV = require('../../libs/av-weapp-min.js');

// 获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  // 事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  // 打开同游列表
  openList: function () {
    wx.navigateTo({
      url: '../list/list?condition'
    })
  },
  // 打开发起计划页
  openInitiate: function () {
    wx.navigateTo({
      url: '../initiate/initiate'
    })
  },
  // 打开地图
  openMap: function () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  onLoad: function () {
    var that = this
    // 调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      // 更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
