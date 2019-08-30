// pages/changeMyInfo/changeMyInfo.js
var app = getApp();
var item = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: true,//手机号是空的
    gender: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.item) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
      item = JSON.parse(options.item);
      console.log("onLoad:item=", item);
      that.setData({
        name: item.name,
        address: item.address,
        gender: item.gender,
        phone: item.phone,
        birthday: item.birthday,
        isEmpty: false,
      });
    }
    that.setData({
      themeColor: app.globalData.themeColor,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 修改性别
  onChangeGender(e) {
    this.setData({
      gender: e.detail.value,
    });
  },

  // 监听手机号的输入
  onPhoneInput(e) {
    var value = e.detail.value;
    //是否显示清空按钮
    if ((value && this.data.isEmpty) || !(value || this.data.isEmpty)) {
      this.setData({
        isEmpty: !this.data.isEmpty,
      });
    }
  },

  // 清空手机号
  onEmptyPhone() {
    this.setData({
      phone: "",
      isEmpty: true,
    });
  },


  formSubmit(e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var value = e.detail.value;
    if (!value.name) {
      that.showToast('请填写姓名');
    } else if (!value.phone) {
      that.showToast('请填写手机号');
    } else if (!value.birthday) {
      that.showToast('请填写生日');
    }
    wx.navigateBack({
      delta: 1
    })
  },

  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})