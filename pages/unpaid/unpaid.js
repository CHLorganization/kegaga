// pages/unpaid/unpaid.js
var app = getApp();
var that = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: '7550 1901 2088 10253',
    shopPhoneNumber: '000 0000 0000',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var color = app.globalData.themeColor.substr(1);
    that.setData({
      themeColorName: app.globalData.themeColorName,
      themeColorOpacity50: '#' + color + "7E",
      themeColorOpacity30: '#' + color + "4C",
      themeColorOpacity15: '#' + color + "26",
      themeColor: app.globalData.themeColor,
      switchIndex: options.switchIndex,
    })
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    //如果不是点击取消订单返回
    if (!myData.isCancelOrder) {
      console.log('myData.isCancelOrder', myData.isCancelOrder)
      wx.switchTab({
        url: '../takeMeal/takeMeal'
      })
    }
    myData.isCancelOrder = false;//退出就恢复默认值
  },

  // 取消订单返回
  onCancelReturn() {
    console.log('onCancelReturn.isCancelOrder', myData.isCancelOrder)
    myData.isCancelOrder = true;
    wx.navigateBack({
      delta: 1,
    })
  },

  // 打开商家地址导航
  openLocation(e) {
    wx.openLocation({
      longitude: Number(myData.longitude),
      latitude: Number(myData.latitude),
      name: myData.name,
      address: myData.address
    })
  },

  // 联系商家
  onContactShop() {
    wx.makePhoneCall({
      phoneNumber: that.data.shopPhoneNumber
    })
  },

  // 去支付
  onPay() {},

  // 取消订单
  onCancel() {
    wx.showModal({
      content: '确认取消订单？',
      confirmColor: that.data.themeColor,
      success(res) {
        if (res.confirm) {
          //用户点击确定
          that.onCancelReturn();
        }
      }
    })
  },

  // 复制
  onCopy() {
    wx.setClipboardData({
      data: that.data.orderNumber,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        })
      }
    })
  },
})

var myData = {
  address: "广东省深圳市南山区深南大道9037号",
  name: "世界之窗",
  latitude: 22.534576,
  longitude: 113.973016,
  isCancelOrder: false,//取消订单标志
}