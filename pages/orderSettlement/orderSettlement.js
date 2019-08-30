// pages/orderSettlement/orderSettlement.js
var app = getApp();
var storageUtil = require("../../utils/storageUtil.js");
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
let that = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchIndex: '0',
    payStyle: '0',
    truePayStyle: '0',
    isPayDialogShow: false,
    isPhoneIconHL: false,
    showPhoneTip: false,
    phone: '',
    phoneNumberTip: '13534019887',
    address: {},
    remark: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad", options);
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
    storageUtil.setStorage(storageUtil.remark, ''); //清空缓存中的备注
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.getAddress();
    that.getRemark();
  },

  //获取地址
  getAddress() {
    storageUtil.getStorage(storageUtil.address).then((res) => {
      if (that.data.address != res.data) {
        that.setData({
          address: res.data,
        });
      }
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.address, {});
    });
  },

  //获取备注
  getRemark() {
    storageUtil.getStorage(storageUtil.remark).then((res) => {
      if (that.data.remark != res.data) {
        that.setData({
          remark: res.data,
        });
      }
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.remark, '');
    });
  },

  // 切换 外卖和自取
  onSwitch(e) {
    this.setData({
      switchIndex: e.detail.value,
    });
  },

  // 选择收货地址
  toChooseAddress(e) {
    if (that.data.switchIndex == '1') {
      wx.navigateTo({
        url: '../manageAddress/manageAddress',
      })
    }
  },

  // 监听手机号的输入
  onPhoneInput(e) {
    that.setData({
      phone: e.detail.value
    });
  },

  // 监听输入框聚焦
  onPhoneFocus(e) {
    if (!that.data.isPhoneIconHL) {
      that.setData({
        isPhoneIconHL: true,
      });
    }
    that.setData({
      showPhoneTip: true
    });
  },

  // 监听输入框失去焦点
  onPhoneBlur(e) {
    var value = e.detail.value;
    if (!value) {
      that.setData({
        isPhoneIconHL: false,
      });
    }
    setTimeout(() => {
      that.setData({
        showPhoneTip: false,
      });
    }, 100);
  },

  // 点击电话号码提示
  onPhoneNumberTip(e) {
    if (that.data.phoneNumberTip != that.data.phone) {
      that.setData({
        phone: that.data.phoneNumberTip,
      });
    }
  },

  // 备注
  toRemark(e) {
    wx: wx.navigateTo({
      url: '../label/label',
    })
  },

  // 显示/隐藏 支付方式弹窗
  showPayDialog() {
    that.setData({
      payStyle: that.data.truePayStyle,
    });
    that.showOrClosePayDialog(!that.data.isPayDialogShow);
  },

  // 切换 支付方式
  onSwitchPay(e) {
    that.setData({
      payStyle: e.detail.value,
    });
  },

  // 确认 支付方式
  onChoosePayStyle() {
    if (that.data.payStyle != that.data.truePayStyle) {
      that.setData({
        truePayStyle: that.data.payStyle
      });
    }
    that.showOrClosePayDialog(!that.data.isPayDialogShow);
  },

  // 支付方式弹窗 动画
  showOrClosePayDialog(boolValue) {
    var animation = wx.createAnimation({
      duration: 200,
    })
    this.animation = animation
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      this.setData({
        isPayDialogShow: boolValue,
      });
    }, 200);
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  // 支付
  onPay() {
    wx.redirectTo({
      url: '../unpaid/unpaid?switchIndex=' + that.data.switchIndex,
    })
  },

  // 支付
  requestPayment() {
    const self = this
    self.setData({
      loading: true
    })

    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId((err, openid) => {
      if (!err) {
        wx.request({
          url: paymentUrl,
          data: {
            openid
          },
          method: 'POST',
          success(res) {
            console.log('unified order success, response is:', res)
            const payargs = res.data.payargs
            wx.requestPayment({
              timeStamp: payargs.timeStamp,
              nonceStr: payargs.nonceStr,
              package: payargs.package,
              signType: payargs.signType,
              paySign: payargs.paySign,
              success(res) {},
              fail(res) {}
            })

            self.setData({
              loading: false
            })
          }
        })
      } else {
        console.log('err:', err)
        self.setData({
          loading: false
        })
      }
    })
  },

  // 消费touchMove事件
  catchtouchmove() {},
})