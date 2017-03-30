// pages/initiate/initiate.js
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    user: null, // 当前用户
    showError: false,
    errorInfo: '错误信息',
    srcPosition: '请选取出发点',
    desPosition: '请选取目的点',
    srcTitle: '',
    srcPoint: null, // 出发点坐标
    desPoint: null, // 目的点坐标
    desTitle: '',
    date: '请选择出发日期',
    time: '请选择出发时间',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    // 获取用户数据
    AV.User.loginWithWeapp().then(user => {
      that.setData({
        user: user
      })
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

  // 点击确定提交表单
  onSubmit: function (res) {
    var that = this
    this.setData({
      showError: false
    })
    var data = res.detail.value // 表单数据
    console.info(that.data.user.id)
    try {
      var Project = AV.Object.extend('Project')
      var project = new Project() // 用于添加的LeanStorage对象
      project.set('title', util.getInputNotEmpty(data.title, '标题不能为空'))

      if (!that.data.srcPoint) {
        throw '请选取出发点'
      }
      project.set('srcPoint', that.data.srcPoint) // 出发点

      if (!that.data.desPoint) {
        throw '请选取目的点'
      }
      project.set('desPoint', that.data.desPoint) // 出发点

      project.set('srcTitle', util.getInputNotEmpty(data.srcTitle, '出发地不能为空'))
      project.set('desTitle', util.getInputNotEmpty(data.desTitle, '目的地不能为空'))

      var timeStr = that.data.date + ' ' + that.data.time
      var startTime = Date.parse(timeStr)
      if (!startTime) {
        throw '请选择出发时间'
      }
      project.set('startTime', new Date(startTime)) // 出发时间

      project.set('duration', util.getInputNotEmpty(data.duration, '旅行时间不能为空'))
      project.set('expectedPeople', util.getInputNotEmpty(data.expectedPeople, '预期人数不能为空'))
      project.set('contact', util.getInputNotEmpty(data.contact, '联系方式不能为空'))
      project.set('content', util.getInputNotEmpty(data.content, '详细信息不能为空'))
      project.set('participant', [that.data.user.id])

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
        var point = { latitude: res.latitude, longitude: res.longitude }; // 坐标点
        var position = res.address // 详细地址
        that.setData({
          srcPoint: point,
          srcPosition: position,
          srcTitle: res.name
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
        var point = { latitude: res.latitude, longitude: res.longitude }; // 坐标点
        var position = res.address // 详细地址
        that.setData({
          desPoint: point,
          desPosition: position,
          desTitle: res.name
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