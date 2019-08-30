// pages/addAddress/addAddress.js
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
  onLoad: function(options) {
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
        houseNumber: item.houseNumber,
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

// 修改性别
  onChangeGender(e){
    this.setData({
      gender: e.detail.value,
    });
  },

// 监听手机号的输入
  onPhoneInput(e){
    var value = e.detail.value;
    //是否显示清空按钮
    if ((value && this.data.isEmpty) || !(value || this.data.isEmpty)) {
      this.setData({
        isEmpty: !this.data.isEmpty,
      });
    }
  },

// 清空手机号
  onEmptyPhone(){
    this.setData({
      phone: "",
      isEmpty: true,
    });
  },

  // 选择收货地址
  chooseLocation() {
    const that = this;
    wx.chooseLocation({
      success(res) {
        console.log('chooseLocation', res);
        that.setData({
          address: res.name,
        });
      }
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var value = e.detail.value;
    if(!value.name){
      wx.showToast({
        title: '请填写收货人',
        icon: 'none',
      })
    } else if (!value.phone){
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
      })
    }else if (!value.address) {
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})