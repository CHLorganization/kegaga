// pages/refund/refund.js
var app = getApp();
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
var that = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var color = app.globalData.themeColor.substr(1);
    this.setData({
      themeColorName: app.globalData.themeColorName, //主题颜色名字
      themeColorOpacity: '#' + color + '26', //主题颜色透明度
      themeColor: app.globalData.themeColor, //主题颜色
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  // 选择图片
  chooseImage() {
    const that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        let imageList = that.data.imageList;
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },

  // 预览图片
  previewImage(e) {
    const current = e.target.dataset.src
    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },

  // 删除图片
  deleteImage(e) {
    let index = e.target.dataset.index;
    let imageList = that.data.imageList;
    imageList.splice(index, 1);
    that.setData({
      imageList
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})