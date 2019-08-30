// pages/points/points.js
let app = getApp();
var util = require("../../utils/util.js");
let that = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentScrollViewHeight: 0,//滚动区域的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    myData.windowHeight = util.getWindowHeight()
    console.log('windowHeight', myData.windowHeight);
    that.setData({
      themeColorName: app.globalData.themeColorName,
      themeColor: app.globalData.themeColor,
      pointData: pointData
    })
    that.getScrollViewHeight();
  },

// 获取滚动区域高度
  getScrollViewHeight(){
    var query = wx.createSelectorQuery();
    query.select('.pointHeader').boundingClientRect();
    query.exec(function (res) {
      if (res[0]) {
        myData.headViewHeight = res[0].height
        console.log('getScrollViewHeight', res[0].height);
      }
      that.setData({
        contentScrollViewHeight: myData.windowHeight - myData.headViewHeight,
      },()=>{
        console.log('getScrollViewHeight', that.data.contentScrollViewHeight);
      });
    });
  },

})

let myData = {
  windowHeight: 0, //window的高度
  headViewHeight: 0, //头部view的高度
}

let pointData = {
  id: 1001,
  name: '消费',
  amount: '￥28.00',
  shopName: '中心书城店',
  time: '2018-10-05 18：20',
  points: '28',
}