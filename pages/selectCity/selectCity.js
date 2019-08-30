// pages/selectcity/selectcity.js
var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var util = require("../../utils/util.js");
var that = {};
let myData = {
  alphabetStartY: 0,
  alphabetHeight: 0,
  scrollItemHeightList:[],
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: [],
    alpha: 'A1',
    alphabet:'A1',
    apHeight: '',
    addBg: false,
    isEmpty: true,
    scrollViewHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      themeColor: app.globalData.themeColor,
      datalist,
    }, () => {
      var query = wx.createSelectorQuery();
      query.select('.search-content').boundingClientRect();
      query.select('.headerView').boundingClientRect();
      query.select('.selector-one').boundingClientRect();
      query.select('#alphanet-selector').boundingClientRect();
      query.selectAll('.section-item').boundingClientRect();
      query.exec((res) => {
        const scrollViewHeight = util.getWindowHeight() - res[0].height - res[1].height;
        const apHeight = scrollViewHeight / 26;
        that.setData({
          scrollViewHeight,
          apHeight
        });
        //字母列表第一个字母的Y坐标
        myData.alphabetStartY = (scrollViewHeight - res[3].height) / 2 + res[0].height + res[1].height;
        // 一个字母的高
        myData.alphabetHeight = res[2].height;

        for (var j = 0; j < res[4].length; j++) {
          myData.scrollItemHeightList[j] = {};
          myData.scrollItemHeightList[j].alphabet = datalist[j].alphabet;
          myData.scrollItemHeightList[j].height = 0;
          for (var k = 0; k <= j; k++) {
            myData.scrollItemHeightList[j].height += res[4][k].height;
          }
        }
        console.log('scrollItemHeightList', myData.scrollItemHeightList)
        console.log('apHeight', res)
      })
    });
    qqmapsdk = new QQMapWX({
      key: 'WXXBZ-BQ7CQ-FK55Z-GH2YM-I4I4Q-REFLG' //这里自己的key秘钥进行填充
    });
    that.onLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //清空搜索框中的值
  onEmptySearchValue(e) {
    this.setData({
      searchValue: "",
      isEmpty: true,
    });
  },

  //监听搜索输入
  onSearchInput(e) {
    var that = this;
    var value = e.detail.value;
    //是否显示清空按钮
    if ((value && that.data.isEmpty) || !(value || that.data.isEmpty)) {
      this.setData({
        isEmpty: !that.data.isEmpty,
      });
    }
    this.setData({
      searchValue: value,
    });
  },

  // 重新定位
  onLocation() {
    util.getCurrentLocation(qqmapsdk, res => {
      console.log('onLoad:', res)
      let city = res.result.ad_info.city
      that.setData({
        city
      });
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

  },

// 选中城市
  onSeleted(e){
    let name = e.currentTarget.dataset.name;
    wx.showToast({
      icon:"none",
      title: name,
    })
  },

  // 城市列表滚动监听
  scrollBind(e) {
    var scrollItemHeightList = myData.scrollItemHeightList;
    for (var i = 0; i < scrollItemHeightList.length; i++) {
      if (e.detail.scrollTop < scrollItemHeightList[i].height) {
        if (scrollItemHeightList[i].alphabet != that.data.alphabet) {
          console.log("切换分类：scrollBind", e);
          that.setData({
            alphabet: scrollItemHeightList[i].alphabet
          });
        }
        break;
      }
    }
  },

  //点击
  handlerAlphaTap(e) {
    console.log('handlerAlphaTap', e);
    let {
      ap
    } = e.target.dataset;
    this.setData({
      alpha: ap,
      addBg: true
    });
  },
  //滑动
  handlerMove(e) {
    console.log('handlerMove', e);
    let {
      datalist,
      apHeight
    } = this.data;
    this.setData({
      addBg: true
    });
    let rY = e.touches[0].clientY; //竖向滑动的距离
    if (rY >= 0) {
      let index = Math.ceil((rY - myData.alphabetStartY - myData.alphabetHeight) / myData.alphabetHeight);
      if (0 <= index < datalist.length) {
        let nonwAp = datalist[index];
        nonwAp && this.setData({
          alpha: nonwAp.alphabet
        });
      }
    }
  },
  //滑动结束
  handlerEnd(e) {
    console.log('handlerEnd', e);
    this.setData({
      addBg: false
    });
  }

})

var datalist = [{
    alphabet: 'A1',
    names: ["安全", "埃及", "阿狸"]
  },
  {
    alphabet: 'B1',
    names: ["宝安区", "北韩", "背景", "部门", "冰海", "北屯市"]
  },
  {
    alphabet: 'C1',
    names: ["长春", "常德", "存单", "慈侃", "茶位", "长沙"]
  },
  {
    alphabet: 'F1',
    names: ["分类", "访问", "服务", "发布", "发现", "返回"]
  },
  {
    alphabet: 'M1',
    names: ["么事", "没写", "明天", "没实现", "没听说", "茅台"]
  },
  {
    alphabet: 'A2',
    names: ["安全", "埃及", "阿狸"]
  },
  {
    alphabet: 'B2',
    names: ["宝安区", "北韩", "背景", "部门", "冰海", "北屯市"]
  },
  {
    alphabet: 'C2',
    names: ["长春", "常德", "存单", "慈侃", "茶位", "长沙"]
  },
  {
    alphabet: 'F2',
    names: ["分类", "访问", "服务", "发布", "发现", "返回"]
  },
  {
    alphabet: 'M2',
    names: ["么事", "没写", "明天", "没实现", "没听说", "茅台"]
  },
  {
    alphabet: 'A3',
    names: ["安全", "埃及", "阿狸"]
  },
  {
    alphabet: 'B3',
    names: ["宝安区", "北韩", "背景", "部门", "冰海", "北屯市"]
  },
  {
    alphabet: 'C3',
    names: ["长春", "常德", "存单", "慈侃", "茶位", "长沙"]
  },
  {
    alphabet: 'F3',
    names: ["分类", "访问", "服务", "发布", "发现", "返回"]
  },
  {
    alphabet: 'M3',
    names: ["么事", "没写", "明天", "没实现", "没听说", "茅台"]
  },
  {
    alphabet: 'A4',
    names: ["安全", "埃及", "阿狸"]
  },
  {
    alphabet: 'B4',
    names: ["宝安区", "北韩", "背景", "部门", "冰海", "北屯市"]
  },
  {
    alphabet: 'C4',
    names: ["长春", "常德", "存单", "慈侃", "茶位", "长沙"]
  },
  {
    alphabet: 'F4',
    names: ["分类", "访问", "服务", "发布", "发现", "返回"]
  },
  {
    alphabet: 'M4',
    names: ["么事", "没写", "明天", "没实现", "没听说", "茅台"]
  },
  {
    alphabet: 'A5',
    names: ["安全", "埃及", "阿狸"]
  },
  {
    alphabet: 'B5',
    names: ["宝安区", "北韩", "背景", "部门", "冰海", "北屯市"]
  },
  {
    alphabet: 'C5',
    names: ["长春", "常德", "存单", "慈侃", "茶位", "长沙"]
  },
  {
    alphabet: 'F5',
    names: ["分类", "访问", "服务", "发布", "发现", "返回"]
  },
  {
    alphabet: 'M5',
    names: ["么事", "没写", "明天", "没实现", "没听说", "茅台"]
  },
  {
    alphabet: 'M6',
    names: ["么事", "没写", "明天", "没实现", "没听说", "茅台"]
  }
]