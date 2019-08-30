// pages/recharge/recharge.js
var app = getApp();
let gitData = ["满500元赠60元的储值奖励", "10会员积分", "50元代金券*2"]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recharge: '0',// 选择充值金额
    gitData: gitData
  },

  onLoad: function (options) {
    const that = this;
    that.setData({
      themeColor: app.globalData.themeColor,
    });
  },

  // 选择充值金额
  onChangeRecharge(e) {
    this.setData({
      recharge: e.detail.value,
    });
  },
})


