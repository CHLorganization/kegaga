// pages/couponTable/couponTable.js
var app = getApp();
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    currentTab: 0,
    useRedPacket: false,
    availableList: [],
    unavailableList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var availables = [];
    var unavailables = [];
    for (var index in couponData) {
      if (couponData[index].isAvailable) {
        availables.push(couponData[index]);
      } else {
        unavailables.push(couponData[index]);
      }
    }
    this.setData({
      availableList: availables,
      unavailableList: unavailables,
      themeColor: app.globalData.themeColor,
    });
  },

// 获取优惠券信息
  getData(){
    const url = urlUtil.findMemberWithCoupon(url.getBrandId(), url.getMemberId());
    util.request(url).then(res => {
      if (res.rtnCode === 10000) {
        console.log("获取优惠券信息,res=", res);
      } else {
        util.showToast('获取优惠券信息失败！');
      }
    }).catch(err => {
      util.showToast('获取优惠券信息失败！');
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      windowHeight: util.getWindowHeight(),
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 切换页面
   */
  switchTab: function (e) {
    this.setData({
      currentTab: parseInt(e.detail.value),
    });
  },

  bindSwiperChange(e) {
    console.log("bindSwiperChange", e);
    this.setData({
      currentTab: parseInt(e.detail.current)
    })
  },

  useRedPacket: function (e) {
    this.setData({
      useRedPacket: !this.data.useRedPacket,
    })
  },

  selectCoupon: function (e) {
    console.log("selectCoupon", e);
    var index = e.currentTarget.dataset.index;
    var select = "availableList[" + index + "].isSelected";
    this.setData({
      [select]: !this.data.availableList[index].isSelected,
    });
  },

  seeDetail: function (e) {
    console.log("seeDetail", e);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

var couponData = [{
  name: "25元水果代金券",
  remark: "指定优惠分类可用",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: true,
  isSelected: true,
  unavailable: [],
}, {
  name: "25元水果代金券",
  remark: "指定优惠分类可用",
  validity: "2018.09.25-2018.10.1",
  isDeadline: false,
  isAvailable: false,
  isSelected: false,
  unavailable: ["限(皇庭广场店)使用", "满65元可用"],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: false,
  isAvailable: true,
  isSelected: false,
  unavailable: [],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: false,
  isSelected: false,
  unavailable: ["选择商品不参与优惠"],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: false,
  isSelected: false,
  unavailable: ["选择商品不参与优惠"],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: false,
  isSelected: false,
  unavailable: ["选择商品不参与优惠"],
},

{
  name: "25元水果代金券",
  remark: "指定优惠分类可用",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: true,
  isSelected: true,
  unavailable: [],
}, {
  name: "25元水果代金券",
  remark: "指定优惠分类可用",
  validity: "2018.09.25-2018.10.1",
  isDeadline: false,
  isAvailable: false,
  isSelected: false,
  unavailable: ["限(皇庭广场店)使用", "满65元可用"],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: false,
  isAvailable: true,
  isSelected: false,
  unavailable: [],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: false,
  isSelected: false,
  unavailable: ["选择商品不参与优惠"],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: false,
  isSelected: false,
  unavailable: ["选择商品不参与优惠"],
}, {
  name: "买二赠一",
  remark: "满两件商品赠送一件",
  validity: "2018.09.25-2018.10.1",
  isDeadline: true,
  isAvailable: false,
  isSelected: false,
  unavailable: ["选择商品不参与优惠"],
}

  , {
    name: "买二赠一",
    remark: "满两件商品赠送一件",
    validity: "2018.09.25-2018.10.1",
    isDeadline: false,
    isAvailable: true,
    isSelected: false,
    unavailable: [],
  }, {
    name: "买二赠一",
    remark: "满两件商品赠送一件",
    validity: "2018.09.25-2018.10.1",
    isDeadline: false,
    isAvailable: true,
    isSelected: false,
    unavailable: [],
  }, {
    name: "买二赠一",
    remark: "满两件商品赠送一件",
    validity: "2018.09.25-2018.10.1",
    isDeadline: false,
    isAvailable: true,
    isSelected: false,
    unavailable: [],
  }, {
    name: "买二赠一",
    remark: "满两件商品赠送一件",
    validity: "2018.09.25-2018.10.1",
    isDeadline: false,
    isAvailable: true,
    isSelected: false,
    unavailable: [],
  }];