let app = getApp();
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
let that = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      themeColorName: app.globalData.themeColorName,
      themeColor: app.globalData.themeColor,
    })
  },

// 获取用户信息
  getData(){
    const url = urlUtil.findMemberWithAssets(url.getBrandId(), url.getMemberId());
    util.request(url).then(res => {
      if (res.rtnCode === 10000) {
        console.log("获取用户信息,res=", res);
      } else {
        util.showToast('获取用户信息失败！');
      }
    }).catch(err => {
      util.showToast('获取用户信息失败！');
    });
  },

  // 余额
  toBalance() {
    wx.navigateTo({
      url: '../balance/balance',
    })
  },

  // 积分
  toPoints() {
    wx.navigateTo({
      url: '../points/points',
    })
  },

// 会员充值
  toRecharge(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  toRights(){
    wx.navigateTo({
      url: '../memberRights/memberRights',
    })
  },

// 券
  toCouponTable(){
    wx.navigateTo({
      url: '../couponTable/couponTable',
    })
  },

// 我的信息
  toChangeInfo(){
    wx.navigateTo({
      url: '../changeMyInfo/changeMyInfo',
    })
  },

  /* 管理地址 */
  toManageAddress() {
    wx.navigateTo({
      url: '../manageAddress/manageAddress',
    })
  },

// 修改密码
  toChangePwd(){
    wx.navigateTo({
      url: '../changePassword/changePassword',
    })
  },

})