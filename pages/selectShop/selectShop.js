// pages/selectshop/selectshop.js
var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,
    city: '',
    isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    that.setData({
      themeColor: app.globalData.themeColor,
      list: list,
    });
    qqmapsdk = new QQMapWX({
      key: 'WXXBZ-BQ7CQ-FK55Z-GH2YM-I4I4Q-REFLG' //这里自己的key秘钥进行填充
    });
    var query = wx.createSelectorQuery();
    query.select('.searchContent').boundingClientRect();
    query.exec((res) => {
      that.setData({
        scrollViewHeight: util.getWindowHeight() - res[0].height,
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      windowHeight: util.getWindowHeight(),
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    util.getCurrentLocation(qqmapsdk, res => {
      console.log('onShow:', res)
      let city = res.result.ad_info.city
      that.setData({
        city
      });
    });
    var locationList = [];
    for (var index in list) {
      locationList.push(list[index].location);
    }
    util.getDistance(qqmapsdk, locationList, res => {
      console.log('onShow getDistance:', res)
      for (var index in res) {
        list[index].distance = (res[index] / 1000).toFixed(1);
        //120km/h
        list[index].time = (res[index] / 2 / 1000).toFixed(0);
      }
      that.setData({
        list
      })
    });
  },

  // 跳转选择城市界面
  onSelectCity(e) {
    wx.navigateTo({
      url: '../selectCity/selectCity',
    })
  },

  // 搜索
  onSearch(e) {
    console.log("onSearch", e);
  },

  //清空搜索框中的值
  onEmptySearchValue(e) {
    this.setData({
      searchValue: "",
      isEmpty: true,
    });
  },
  //监听搜索输入
  onSearchInput(e) {
    var that = this;
    console.log("searchValueInput", e);
    var value = e.detail.value;
    //是否显示清空按钮
    if ((value && that.data.isEmpty) || !(value || that.data.isEmpty)) {
      this.setData({
        isEmpty: !that.data.isEmpty,
      });
    }
    this.setData({
      searchValue: value,
    });
  },

  onSelected(e) {
    const that = this;
    console.log("onSelected", e);

    wx.showModal({
      content: '当前位置不在所选门店的配送范围',
      showCancel: false,
      confirmColor: that.data.themeColor,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //****************************
  getTgLocation: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res) {
        console.log("res----------", res)
        //make datas 
        var newCover = {
          latitude: that.data.tglatitude,
          longitude: that.data.tglongitude,
        };

        var newMeters = getDistance(newCover.latitude, newCover.longitude, res.latitude, res.longitude) / 1000;
        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }
        console.log("newMeters----------", newMeters)

        var meters = new Number(newMeters);
        var showMeters = meters.toFixed(2);

        var oriCovers = that.data.covers;
        oriCovers.push(newCover);
        console.log("oriCovers----------")
        console.log(oriCovers);

        that.setData({
          latitude: that.data.tglatitude, //res.latitude,
          longitude: that.data.tglongitude, //res.longitude,
          markers: [],
          covers: oriCovers,
          meters: showMeters,
        });
      },
    })
  }
})

function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) {
    return d * Math.PI / 180;
  }
}

var list = [{
  selected: true,
  name: '香蜜湖1店',
  canSend: true,
  local: '深圳市福田区香蜜湖度假村',
  time: 40,
  location: {
    latitude: 30.542460,
    longitude: 110.278500
  },
  distance: 3
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '北京2店',
  canSend: false,
  local: '北京市福田区香蜜二街845号',
  time: 45,
  location: {
    latitude: 39.984060,
    longitude: 116.307520
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 21.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 5,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: true,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 1.5
}, {
  selected: false,
  name: '香蜜湖2店',
  canSend: false,
  local: '深圳市福田区香蜜二街132号',
  time: 45,
  location: {
    latitude: 33.542460,
    longitude: 113.278500
  },
  distance: 5
}]