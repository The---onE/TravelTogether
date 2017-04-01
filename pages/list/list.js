// pages/list/list.js
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    loading: true, // 加载中
    list: [], // 初始列表
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showNavigationBarLoading();
    this.getData();
  },
  onReady: function () {
    var that = this;
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // 重新显示时刷新数据
    this.getData()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 加载数据
  getData: function () {
    var that = this
    var now = new Date()
    var query = new AV.Query('Project')
    query.greaterThanOrEqualTo('startTime', now)
    query.ascending('startTime')
    query.find().then(function (data) {
      // 查询成功
      wx.hideNavigationBarLoading();
      // 处理数据
      data.forEach(function(i) {
        // 格式化时间
        var time = util.getDateString(i.get('startTime'), "MM-dd")
        i.set('time', time)
      })
      that.setData({
        loading: false, // 加载完成
        list: data // 加载数据
      });
    }, function (error) {
      console.error(error)
    });
  },
  // 打开发起计划页
  openInitiate: function (e) {
    wx.navigateTo({
      url: '../initiate/initiate'
    })
  }
})

