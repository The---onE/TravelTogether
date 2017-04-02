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
    if (wx.showLoading) {
      wx.showLoading({
        title: '加载中'
      })
    }
    var that = this
    // 获取用户数据
    AV.User.loginWithWeapp().then(user => {
      var condition = options.condition
      that.setData({
        user: user,
        condition: condition
      })
      // 加载列表
      this.getData();
    }).catch(console.error)
  },
  onReady: function () {
    var that = this;
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // 重新显示时刷新数据
    if (this.data.user) {
      this.getData()
    }
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
    var condition = this.data.condition
    var query = new AV.Query('Project')

    switch (condition) {
      case '1':
        // 准备中列表
        query.notEqualTo('status', -1)
        query.greaterThanOrEqualTo('startTime', now)
        query.ascending('startTime')
        break
      case '2':
        // 自己发起的
        query.notEqualTo('status', -1)
        query.equalTo('creater', that.data.user.id)
        query.ascending('startTime')
      case '3':
        // 自己加入的
        query.notEqualTo('status', -1)
        query.equalTo('participant', that.data.user.id)
        query.ascending('startTime')
      default:
        // 全部计划
        query.notEqualTo('status', -1)
        query.ascending('startTime')
        break;
    }
    query.find().then(function (data) {
      // 查询成功
      wx.hideNavigationBarLoading();
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      // 处理数据
      data.forEach(function (i) {
        // 格式化时间
        var time = util.getDateString(i.get('startTime'), "MM-dd")
        i.set('time', time)
        // 获取当前实际人数
        var participant = i.get('participant')
        var count = participant.length
        i.set('actualPeople', count)
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

