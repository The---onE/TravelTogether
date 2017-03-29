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
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 打开准备中列表
  openWaiting: function () {
    wx.navigateTo({
      url: '../list/list'
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
  // 打开地图(旧)
  openMap2: function () {
    wx.navigateTo({
      url: '../map/map2'
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
  }
})
