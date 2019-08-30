// pages/takeMeal/takeMeal.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sCommon: wx.translate.staticText.common,
    sText: wx.translate.staticText.takeMeal,
    orderType:0,
    orderLists: null,
    contentScrollViewHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({orderLists});
    myData.windowHeight = util.getWindowHeight();
    //获取购物车tabBar高度
    var query = wx.createSelectorQuery();
    query.select('.orderTab').boundingClientRect()
    query.exec((res) => {
      console.log("onLoad", res[0].height);
      if (res[0]) {
        myData.tabHeight = res[0].height
      }
      // 计算出scrollView的高度
      that.setData({
        contentScrollViewHeight: myData.windowHeight - myData.tabHeight,
      });
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
    wx.setNavtitle("");
  },
  toOrderDetail(e){
    let thisOrder = JSON.stringify(e.currentTarget.dataset.thisorder);
    wx.setStorage({
      key: 'thisOrder',
      data: thisOrder
    });
    wx.navigateTo({
      url:'../orderDetail/orderDetail?thisOrder='+thisOrder
    })
  },
  changeOrderType(e){
    this.setData({ orderType: parseInt(e.detail.value)})
  },
  cancelOrder(){
    wx.showModal({
      title:"是否确认取消该订单",
      // content:"是否确认取消该订单",
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})

var myData = {
  windowHeight: 0, //window的高度
  tabHeight: 0, //当前订单和历史订单的tab的高度
}

let orderLists = [
  {
    shop: {
      shopName: '中心城店',
      address: '福民三路112号三楼3195',
      imgUrl: '../../image/food.png'
    },
    type: 0,//自取还是外卖
    orderDate: '2018.10.05',
    process: 2,//订单进展状态
    finalProcess: '',
    orderNum: '7550 1901 2088 10253',
    takeNum: '088688',
    packing: 3.5,
    peisong: 5,
    preferential: 13,
    num: 3,
    total: 75,
    willReachTime: '12:04',
    remark: '不打包',
    customerData: {
      name: "周杰伦（先生）",
      phone: '17520460359',
      address: '奥林匹克大厦，6层G室，彩虹云宝公司'
    },
    goodsList: [
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      }
    ]
  },
  {
    shop: {
      shopName: '中心城店',
      address: '福民三路112号三楼3195',
      imgUrl: '../../image/food.png'
    },
    type: 1,//自取还是外卖
    orderDate: '2018.10.05',
    process: 3,//订单进展状态
    finalProcess: '已取消',
    takeNum: '088688',
    orderNum: '7550 1901 2088 10258',
    packing: 3.5,
    peisong: 5,
    preferential: 13,
    num: 3,
    total: 75,
    willReachTime: '12:04',
    remark: '不打包',
    customerData: {
      name: "周杰伦（先生）",
      phone: '17520460359',
      address: '奥林匹克大厦，6层G室，彩虹云宝公司'
    },
    goodsList: [
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      }
    ]
  },
  {
    shop: {
      shopName: '中心城店',
      address: '福民三路112号三楼3195',
      imgUrl: '../../image/food.png'
    },
    type: 1,//自取还是外卖
    orderDate: '2018.10.05',
    process: 3,//订单进展状态
    finalProcess: '已完成',
    takeNum: '088688',
    orderNum: '7550 1901 2088 10258',
    packing: 3.5,
    peisong: 5,
    preferential: 13,
    num: 3,
    total: 75,
    willReachTime: '12:04',
    remark: '不打包',
    customerData: {
      name: "周杰伦（先生）",
      phone: '17520460359',
      address: '奥林匹克大厦，6层G室，彩虹云宝公司'
    },
    goodsList: [
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      },
      {
        name: "柠檬炸天茶烤鸡腿香喷喷贼好吃",
        subtext: "(小份/低热量)",
        num: 1,
        discount: 40,
        money: 26,
        img: '../../image/food.png'
      }
    ]
  },
]