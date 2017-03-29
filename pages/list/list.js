// pages/list/list.js
Page({
  data: {
    loading: true, // 加载中
    list: [], // 初始列表
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showNavigationBarLoading();
  },
  onReady: function () {
    var that = this;
    // 页面渲染完成
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      var data = getData();
      that.setData({
        loading: false, // 加载完成
        list: data // 加载数据
      });
    }, 1000);
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
  // 打开发起计划页
  openInitiate: function () {
    wx.navigateTo({
      url: '../initiate/initiate'
    })
  }
})

// TODO 加载数据
function getData() {
  var data = [{
    id: "0",
    title: "Hahaha",
    source: "A",
    destination: "B",
    time: "2017-01-01"
  }];
  for (var i = 1; i < 10; ++i) {
    data[i] = {
      id: "" + i,
      title: "Hehe",
      source: "C",
      destination: "D",
      time: "2017-02-02"
    };
  }
  return data;
}