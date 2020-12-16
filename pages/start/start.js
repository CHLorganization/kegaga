//login.js
//获取应用实例
var app = getApp();
const util = require('../../utils/util.js');//工具类
const urlUtil = require("../../utils/urlUtil.js");
Page({
  data: {
  },

  onLoad:function(){
    var that = this;
    that.loginMember(app.globalData.brandId, app.globalData.openId);
  },
  onShow:function(){
  },
  onReady: function(){
  },

  // 查询当前登录着的会员信息(亦可判断是否会员)
  loginMember(brandId, weixinOpenId) {
    const that = this;
    const url = urlUtil.loginMember(brandId, weixinOpenId);
    util.request(url).then(res => {
      console.log("会员信息,res=", res);
      if (res.rtnCode === 10000) {
      } else {
        util.showToast('会员信息失败！');
      }
    }).catch(err => {
      util.showToast('会员信息失败！');
    });
  },

// 获取用户信息
  getUserInfo(e){
    
  },

// 获取用户手机号
  getPhoneNumber(e){

  },

// 关注
  onFollow(){
    wx.switchTab({
      url: "../order/order",
    });
  },
});