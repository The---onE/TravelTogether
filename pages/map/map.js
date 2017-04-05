// pages/map/map.js
// 获取应用实例
var app = getApp();

// 获取LeanCloud对象
const AV = require('../../libs/av-weapp-min.js');

var height; // 屏幕高度，在onLoad中获取
var width; // 屏幕宽度，在onLoad中获取

var mapCtx; // 地图上下文，用于获取或设置中心坐标，在定位成功后初始化

var mapHeight; // 地图控件高度，在onLoad获取页面高度后计算
var mapWidth; // 地图控件宽度，在onLoad获取页面宽度后计算
var MAP_HEIGHT_SCALA = 1; // 高度占总高度比例
var MAP_WIDTH_SCALA = 1; // 宽度占总宽度比例

var SOURCE_MARKER_RES = '/res/source.png'; // 出发点图标
var DESTINATION_MARKER_RES = '/res/destination.png'; // 目的点图标
var CENTER_CONTROL_RES = '/res/selected.png'; // 中心控件图标

var LOCATION_TYPE = 'gcj02'; // 定位类型，gcj02 返回可用于地图的坐标，wgs84 返回 gps 坐标
var DEFAULT_SCALA = 12; // 默认缩放，范围5-18

var location = {}; // 定位坐标
var LOCATION_MARKER_ID = 0; // 定位点ID
var locationMarker = { id: LOCATION_MARKER_ID }; // 定位标记

var CENTER_CONTROL_ID = 0; // 中心控件ID
var centerControl = { id: CENTER_CONTROL_ID, }; // 中心控件

var search; // 搜索框文本

var markers = [
  // 定位标记
  //locationMarker,
]; // 地图标记

var controls = [
  // 中心控件
  centerControl,
]; // 地图控件

var lines = [

]; // 地图路线

Page({
  data: {
  },

  // 定位
  getLocation: function () {
    var that = this;
    // 开始定位
    wx.getLocation({
      type: LOCATION_TYPE, // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // 定位成功
        // 定位坐标
        location = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        that.addCenterControl(); // 添加中心控件
        // 更新数据
        that.setData({
          position: location, // 定位坐标
          scala: DEFAULT_SCALA, // 缩放比例[5-18]
          markers: markers, // 标记点
        });
        mapCtx = wx.createMapContext('map');
      },
      fail: function () {
        // 定位失败
        wx.showModal({
          title: '定位失败',
          showCancel: false
        })
      },
      complete: function () {
        // 定位完成
      }
    })
  },

  // 添加地图中心控件
  addCenterControl: function () {
    centerControl = {
      id: CENTER_CONTROL_ID,
      iconPath: CENTER_CONTROL_RES,
      position: {
        left: mapWidth / 2 - 40 / 2,
        top: mapHeight / 2 - 40,
        width: mapWidth * 0.1,
        height: mapWidth * 0.1
      }, // 根据地图宽高和图片尺寸计算位置
      clickable: true
    }
    controls[CENTER_CONTROL_ID] = centerControl;
    this.setData({
      controls: controls,
    })
  },

  // 加载同游计划路线
  showProjects: function () {
    var that = this;
    var query = new AV.Query('Project')
    query.find().then(function (data) {
      // 查询成功
      data.forEach(function (i) {
        var start = i.get('srcPoint')
        var end = i.get('desPoint')
        that.addMarker(start, SOURCE_MARKER_RES)
        that.addMarker(end, DESTINATION_MARKER_RES)
        that.addLine(start, end, '#51c33288', 5)
      })
      that.setData({
        markers: markers,
        lines: lines
      });
    }, function (error) {
      // 查询失败
      that.showPrompt('加载收藏失败');
    });
  },
  // 将点添加到标记中
  addMarker: function (point, res) {
    // 添加标记
    markers.push({
      id: markers.length,
      iconPath: res,
      latitude: point.latitude,
      longitude: point.longitude
    });
  },
  // 添加线段
  addLine: function (start, end, color, width) {
    var points = [start, end];
    lines.push({
      points: points,
      color: color,
      width: width
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取页面大小
        height = res.windowHeight;
        width = res.windowWidth;

        // 设置地图大小
        mapHeight = height * MAP_HEIGHT_SCALA;
        mapWidth = width * MAP_WIDTH_SCALA;
        that.setData({
          mapHeight: mapHeight + 'px',
          mapWidth: mapWidth + 'px'
        })
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
    this.getLocation(); // 定位
    this.showProjects(); // 显示收藏点
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})