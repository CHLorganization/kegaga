var app = getApp();
var storageUtil = require("../../utils/storageUtil.js");
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
var that = {};
// pages/search/search.js
Page({
  data: {
    focus: true,
    isKeyShow: true,
    searchValue: '',
    productData: [],
    historyKeyList: [],
    hotKeyList: [],
    isEmpty: true,
    scrollViewHeight:0,
  },

  onLoad: function(options) {
    that = this;
    that.getScrollViewHeight();
    that.loadHistoryKeyList();
    that.onLoadDishData();
    that.setData({
      hotKeyList: remen,
      themeColorName: app.globalData.themeColorName,
      themeColor: app.globalData.themeColor,
    });
  },

  getScrollViewHeight(){
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.search-content').boundingClientRect();
    query.exec((res)=> {
      console.log("onReady", res[0].height);
      var searchContentHeight = 0;
      if (res[0]) {
        searchContentHeight = res[0].height;
      }
      that.setData({
        scrollViewHeight: util.getWindowHeight() - searchContentHeight,
      });
    })
  },

  //加载并更新历史搜索key
  loadHistoryKeyList() {
    storageUtil.getStorage(storageUtil.historyKeyList).then((res) => {
      that.setData({
        historyKeyList: res.data,
      });
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.historyKeyList, []);
    });
  },

  //清空搜索框中的值
  onEmptySearchValue(e) {
    this.setData({
      searchValue: "",
      isEmpty: true,
    });
  },

  // 点击历史或热门搜索key
  onKeySearch(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      isEmpty: false,
      searchValue: key,
      isKeyShow: false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },

  // 点击搜索按钮
  onSearch(e) {
    var searchKey = this.data.searchValue;
    if (!searchKey) {
      this.setData({
        focus: true,
        isKeyShow: true,
      });
      return;
    };

    this.setData({
      isKeyShow: false,
    })

    this.data.productData.length = 0;
    this.searchProductData();

    this.saveSearchHistoryKey(searchKey);
  },
  //保存搜索的key
  saveSearchHistoryKey(key) {
    var that = this;
    storageUtil.getStorage(storageUtil.historyKeyList).then((res) => {
      //如果该key值已经存在就无须再保存
      if (res.data.indexOf(key) < 0) {
        res.data.unshift(key);
        if (res.data.length > 9) { //最多只能9个标签
          res.data.length = 9;
        }
        //将key值保存在缓存中
        storageUtil.setStorage(storageUtil.historyKeyList, res.data);
        //更新历史搜索key
        that.setData({
          historyKeyList: res.data
        });
      }
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.historyKeyList, []);
    });
  },
  //监听搜索输入
  onSearchInput(e) {
    var that = this;
    console.log("searchValueInput", e);
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
    if (!value && this.data.productData.length == 0) {
      this.setData({
        isKeyShow: true,
      });
    }
  },
  // 搜索数据
  searchProductData() {
    var that = this;

  },

  onLoadDishData(){
    var that = this;
    wx.request({
      url: urlUtil.goodsList,
      data: {
        page: 1,
        pageSize: 10000,
        categoryId: ""
      },
      success:(res)=>{
        console.log("onLoadDishData",res);
        if (res.data.code != 0 || res.data.data.length == 0) {
          return;
        }
        var goods = []
        var temp;
        for (var i = 0; i < res.data.data.length; i++) {
          temp = res.data.data[i];
          temp.minPrice = temp.minPrice.toFixed(2);
          temp.originalPrice = temp.originalPrice.toFixed(2);
          goods.push(temp);
        }
        console.log("goods", goods);
        that.setData({
          goods: goods,
        });
      },

    });
  },

});

var remen = ["鲜笋炖肉", "茶碗蛋", "鲜虾春卷", "小米南瓜粥", "猪蹄高汤面", ];