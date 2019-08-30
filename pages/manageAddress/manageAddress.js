// pages/manageaddress/manageaddress.js
var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var util = require("../../utils/util.js");
var storageUtil = require("../../utils/storageUtil.js");
Page({

  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    scrollViewHeight: 0,
    isNoAddress: false,
    recommend:'',
  },

  onLoad(e) {
    var that = this;
    that.getScrollViewHeight();
    for (var i = 0; i < addressList.length; i++) {
      that.data.items.push({
        content: addressList[i],
        isTouchMove: false //默认隐藏删除
      })
    }
    qqmapsdk = new QQMapWX({
      key: 'WXXBZ-BQ7CQ-FK55Z-GH2YM-I4I4Q-REFLG' //这里自己的key秘钥进行填充
    });
    util.getCurrentLocation(qqmapsdk, res => {
      console.log('onLoad:', res)
      let recommend = res.result.formatted_addresses.recommend
      that.setData({
        recommend: recommend,
      });
    });
    that.setData({
      themeColor: app.globalData.themeColor,
      items: that.data.items,
    });
  },

  onShow(e) {
    console.log("manageAddress:onShow",e);
    var that = this;
    //如果没有地址
    if (that.data.items.length == 0) {
      that.setData({
        isNoAddress: true,
      });
    }
  },

  // 重新定位
  onLocation(e) {
    const that = this;
    util.getCurrentLocation(qqmapsdk, res => {
      console.log('onLocation:', res)
      let recommend = res.result.formatted_addresses.recommend
      that.setData({
        recommend: recommend,
      });
    });
  },

  // 选择地址
  chooseAddress(e) {
    var that = this;
    console.log("chooseAddress", e);
    var content = e.currentTarget.dataset.item.content;
    storageUtil.setStorage(storageUtil.address, content);
    wx: wx.navigateBack({
      delta: 1,
    })
  },

  // 编辑地址
  editAddress(e) {
    var content = e.currentTarget.dataset.item.content;
    wx.navigateTo({
      url: "../addAddress/addAddress?item=" + JSON.stringify(content),
    })
  },

  //删除地址
  delAddress(e) {
    var that = this;
    that.data.items.splice(e.currentTarget.dataset.index, 1);
    if (that.data.items.length == 0) {
      that.setData({
        isNoAddress: true,
      });
    }
    that.setData({
      items: that.data.items
    })
  },

  // 添加地址
  addAddress(e) {
    wx.navigateTo({
      url: "../addAddress/addAddress"
    })
  },

  // 计算滚动的高度scrollViewHeight
  getScrollViewHeight() {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.headerView').boundingClientRect();
    query.select('.btnArea').boundingClientRect();
    query.exec((res) => {
      console.log("onReady", res);
      that.setData({
        scrollViewHeight: util.getWindowHeight() - res[0].height - res[1].height,
      });
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标

      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });

    that.data.items.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })

    //更新数据
    that.setData({
      items: that.data.items
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

})

var addressList = [{
  id: 10010,
  address: "奥林匹克大厦",
  name: "李李",
  gender: "1",
  phone: "13534019987",
  houseNumber: "6楼6G彩虹云宝"
}, {
  id: 10011,
  address: "华业玫瑰四季",
  name: "小彭",
  gender: "0",
  phone: "15040018830",
  houseNumber: "2期三单元24B"
}, {
  id: 10012,
  address: "莱蒙水榭春天",
  name: "游",
  gender: "0",
  phone: "13510269799",
  houseNumber: "5期四栋B座30A"
}, {
  id: 10013,
  address: "皇庭广场",
  name: "易",
  gender: "1",
  phone: "13751135507",
  houseNumber: "三层3102号炉鱼"
}, ]