// pages/order/order.js
var app = getApp();
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
var storageUtil = require("../../utils/storageUtil.js");
var that = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    autoplay: true,
    interval: 3500,
    duration: 1500,
    banners: [],

    isFollow: false,
    isDialogShow: false,
    isShoppingCartTabShow: false,
    isShoppingCartShow: false,
    animationData: {},
    shoppingCartAnimationData: {},
    switchIndex: 0,

    categories: [],
    goodsList: [],
    classifyViewed: null,
    goodsViewed: null,
    activeCategoryId: 0,
    goodsListCurrent: [],
    shoppingCartList: [],
    shoppingCartListQuantity: 0,

    contentScrollViewHeight: 0,
    isScrollHaveHeight: false,
    isPageScrollDown: true,
    pageScrollTop: 0,
    pageScrollViewHeight: 0,

    scrollHeight: 0,
    scrollTop: 0,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    myData.windowHeight = util.getWindowHeight()
    var color = app.globalData.themeColor.substr(1);
    this.setData({
      themeColorName: app.globalData.themeColorName, //主题颜色名字
      themeColorOpacity: '#' + color + '26', //主题颜色透明度
      themeColor: app.globalData.themeColor, //主题颜色
      contentScrollViewHeight: myData.windowHeight, //滚动区域的高度
    });
    if (that.data.isFollow) {
      wx.showLoading({
        title: '数据加载中',
        mask: true,
        success(res) {
          that.initData();
        }
      });
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var that = this;
    //每次show时，将弹窗关闭
    if (that.data.isDialogShow || that.data.isShoppingCartShow) {
      that.setData({
        isDialogShow: false, //规格弹窗
        isShoppingCartShow: false, //购物车列表弹窗
      });
    }
  },

  // 加载数据
  initData: function() {
    // var that = this;
    that.getFood();
    that.getBanners();
  },

  getFood: function() {
    // var that = this;
    /*获取菜品数据 */
    wx.request({
      url: urlUtil.goodsCategory,
      success: function(res) {
        var categories = []; //{ id: 0, name: "全品类" }
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
            categories[i].quantity = 0;
          }
        }
        console.log("categories", categories);
        that.getGoods(0, categories); //获取全品类商品
      },
      fail: function() {
        wx.hideLoading()
      }
    })
  },
  getGoods: function(categoryId, categories) {
    if (categoryId == 0) {
      categoryId = "";
    }
    // var that = this;
    wx.request({
      url: urlUtil.goodsList,
      data: {
        page: 1,
        pageSize: 10000,
        categoryId: categoryId
      },
      success: function(res) {
        if (res.data.code != 0 || res.data.data.length == 0) {
          return;
        }
        var goods = []
        var temp;
        for (var i = 0; i < res.data.data.length; i++) {
          temp = res.data.data[i];
          temp.minPrice = temp.minPrice.toFixed(2);
          temp.originalPrice = temp.originalPrice.toFixed(2);
          temp.quantity = 0;
          goods.push(temp);
        }
        // var categories = app.globalData.categories
        var goodsList = [],
          id, key, name, typeStr, goodsTemp = [];
        for (let i = 0; i < categories.length; i++) {
          id = categories[i].id;
          key = categories[i].key;
          name = categories[i].name;
          typeStr = categories[i].type;
          goodsTemp = [];
          for (let j = 0; j < goods.length; j++) {
            if (goods[j].categoryId === id) {
              goodsTemp.push(goods[j])
            }
          }
          if ((that.data.activeCategoryId === null) & (goodsTemp.length > 0)) {
            that.setData({
              activeCategoryId: categories[i].id,
            })
          }
          if (goodsTemp.length == 0) { //该分类下没有数据，则该分类不显示
            categories.splice(i, 1)
            i--;
          } else {
            goodsList.push({
              'id': id,
              'key': key,
              'name': name,
              'type': typeStr,
              'goods': goodsTemp
            })
          }
        }

        console.log("categories=", categories);
        console.log("goodsList=", goodsList);
        that.setData({
          categories: categories,
          goodsList: goodsList,
          classifyViewed: categories[0].id,
          // goodsViewed: categories[0].id,
          scrolltop: 0,
          goodsListCurrent: goodsList[0],
        }, () => {
          var query = wx.createSelectorQuery();
          query.select('.headerContent').boundingClientRect()
          query.select('.exhibition').boundingClientRect()
          query.select('.serarch-content').boundingClientRect()
          query.selectAll('.goodsItemHeight').boundingClientRect()
          query.select('.shoppingCartTab').boundingClientRect()
          query.exec(function(res) {
            console.log("onReady", res);
            console.log("onReady", res[0].height);
            if (res[0]) {
              myData.headViewHeight = res[0].height
            }
            if (res[4]) {
              myData.shoppingCartTabHeight = res[4].height
            }
            that.setData({
              contentScrollViewHeight: myData.windowHeight - myData.headViewHeight - myData.shoppingCartTabHeight,
              pageScrollViewHeight: myData.headViewHeight + myData.windowHeight,
            });
            var exhibitionHeight = 0;
            if (res[1]) {
              exhibitionHeight = res[1].height;
            }
            if (res[3]) {
              for (var j = 0; j < res[3].length; j++) {
                myData.scrollItemHeightList[j] = {};
                myData.scrollItemHeightList[j].id = categories[j].id;
                myData.scrollItemHeightList[j].height = exhibitionHeight + res[2].height;
                for (var k = 0; k <= j; k++) {
                  myData.scrollItemHeightList[j].height += res[3][k].height;
                }
              }
            }
            console.log("myData=", myData);
          })
        });
        wx.hideLoading();
      },
      fail: function() {
        wx.hideLoading();
      }
    })
  },

  /*获取轮播数据 */
  getBanners: function() {
    // var that = this
    wx.request({
      url: urlUtil.bannerList,
      data: {
        key: 'mallName'
      },
      success: function(res) {
        console.log("请求banners返回代码", res.data.code)
        if (res.data.code === 0) {
          var banners = [];
          if (res.data.data.length > 2) {
            for (var i = 0; i < 2; i++) {
              banners[i] = res.data.data[i];
            }
          } else {
            banners = res.data.data;
          }
          that.setData({
            banners: banners
          });
        } else if ((res.data.code === 404) || (res.data.code === 700) || (res.data.code === 701)) {
          that.setData({
            showNoBanners: true
          })

        } else {
          that.setData({
            showNoBanners: true
          })
          that.showPopup('.banners_warn_Popup')
        }
      }
    })
  },

  tapClassify(e) {
    // var that = this;
    var id = e.target.dataset.id;
    that.setData({
      goodsViewed: id,
      classifyViewed: id
    });
  },

  toDetailsTap(e) {

  },

  scrollBind: function(e) {
    // var that = this;
    var scrollItemHeightList = myData.scrollItemHeightList;
    for (var i = 0; i < scrollItemHeightList.length; i++) {
      if (e.detail.scrollTop < scrollItemHeightList[i].height) {
        if (scrollItemHeightList[i].id != that.data.classifyViewed) {
          console.log("切换分类：scrollBind", e);
          that.setData({
            classifyViewed: scrollItemHeightList[i].id
          });
        }
        break;
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 选择门店
  onSelectShop(e) {
    wx.navigateTo({
      url: '../selectShop/selectShop',
    })
  },

  // 自取/外卖切换
  onSwitchTap(e) {
    this.setData({
      switchIndex: e.detail.value,
    });
    if (e.detail.value == 1) {
      wx.navigateTo({
        url: '../manageAddress/manageAddress',
      })
    }
  },

  //点击搜索
  doSearch() {
    wx.navigateTo({
      url: "../search/search"
    })
  },

  dialogCatchTap(e) {
    console.log("dialogCatchTap", e);
  },

  // 做法
  methodTap(e) {
    console.log("methodTap", e);
  },

  attributesTap(e) {
    console.log("attributesTap", e);
  },

  ingredientTap(e) {
    console.log("ingredientTap", e);
  },

  /**
   * 显示、关闭弹窗
   */
  showDialog(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    console.log('currentStatu:', currentStatu);
    // var that = this;
    if (currentStatu == "open") {
      that.showOrCloseDialog(true);
    } else {
      that.showOrCloseDialog(false);
    }
  },

  /**
   * 显示、关闭弹窗的动画
   */
  showOrCloseDialog(boolValue) {
    if (that.data.isDialogShow != boolValue) {
      var animation = wx.createAnimation({
        duration: 200,
      })
      this.animation = animation
      animation.scale(0.5, 0.5).step();
      this.setData({
        animationData: animation.export()
      })
      setTimeout(() => {
        this.setData({
          isDialogShow: boolValue,
        });
      }, 200);
      setTimeout(() => {
        animation.scale(1, 1).step()
        this.setData({
          animationData: animation.export()
        })
      }, 200)
    }
  },

  /**
   * 显示、关闭购物车列表
   */
  showShoppingCart(e) {
    // var that = this;
    that.showOrCloseShoppingCart(!that.data.isShoppingCartShow);
  },

  /**
   * 显示、关闭购物车列表的动画
   */
  showOrCloseShoppingCart(boolValue) {
    if (that.data.isShoppingCartShow != boolValue) {
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
          isShoppingCartShow: boolValue,
        });
      }, 200);
      setTimeout(() => {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }, 200)
    }
  },

  /**
   * 加操作
   */
  onAdd(e) {
    // var that = this;
    that.showOrCloseDialog(false);
    that.showShoppingCartTab(); // 第一次加入购物车时，要显示购物车的tabBar
    let cindex = e.currentTarget.dataset.cindex; //类别index
    let iindex = e.currentTarget.dataset.iindex; //对应类别下列表的index
    let cQuantity = "categories[" + cindex + "].quantity";
    let iQuantity = "goodsList[" + cindex + "].goods[" + iindex + "].quantity";
    that.setData({
      [cQuantity]: that.data.categories[cindex].quantity + 1, //左侧类别显示的数量
      [iQuantity]: that.data.goodsList[cindex].goods[iindex].quantity + 1, //某个菜品显示的数量
      shoppingCartListQuantity: that.data.shoppingCartListQuantity + 1, //购物车显示的数量
    }, () => {
      let shoppingCartList = that.data.shoppingCartList;
      let isExist = false; //购物车中是否存在该菜品
      for (let i = 0; i < shoppingCartList.length; i++) {
        if (shoppingCartList[i].cindex == cindex && shoppingCartList[i].iindex == iindex) {
          let sQuantity = "shoppingCartList[" + i + "].data.quantity";
          that.setData({
            [sQuantity]: shoppingCartList[i].data.quantity, //共享地址指向，只需要更新即可，不用+1
          });
          isExist = true;
          break;
        }
      }
      //购物车中不存在该菜品
      if (!isExist) {
        shoppingCartList.push({
          'data': that.data.goodsList[cindex].goods[iindex], //这样赋值是的数据地址指向相同，在加减操作时，只需要改变一处
          'cindex': cindex,
          'iindex': iindex,
        });
        that.setData({
          shoppingCartList,
        });
      }
    });
  },

  // 第一次加入购物车时，要显示购物车的tabBar
  showShoppingCartTab() {
    //购物车tabBar高度为0时，先显示购物车tabBar，再获取其高度，计算出scrollView的高度
    if (myData.shoppingCartTabHeight == 0) {
      that.setData({
        isShoppingCartTabShow: true, //先显示购物车tabBar
      }, () => {
        //获取购物车tabBar高度
        var query = wx.createSelectorQuery();
        query.select('.shoppingCartTab').boundingClientRect()
        query.exec((res) => {
          console.log("onReady", res[0].height);
          if (res[0]) {
            myData.shoppingCartTabHeight = res[0].height
          }
          // 计算出scrollView的高度
          that.setData({
            contentScrollViewHeight: myData.windowHeight - myData.headViewHeight - myData.shoppingCartTabHeight,
          });
        });
      });
    } else if (!that.data.isShoppingCartTabShow) {
      //已经获得购物车tabBar高度，但是购物车未显示时，显示购物车并重新计算scrollView的高度
      that.setData({
        isShoppingCartTabShow: true,
        contentScrollViewHeight: myData.windowHeight - myData.headViewHeight - myData.shoppingCartTabHeight,
      });
    }
  },

  /**
   * 减操作
   */
  onReduce(e) {
    let cindex = e.currentTarget.dataset.cindex;
    let iindex = e.currentTarget.dataset.iindex;
    let cQuantity = "categories[" + cindex + "].quantity";
    let iQuantity = "goodsList[" + cindex + "].goods[" + iindex + "].quantity";
    that.setData({
      [cQuantity]: that.data.categories[cindex].quantity - 1,
      [iQuantity]: that.data.goodsList[cindex].goods[iindex].quantity - 1,
      shoppingCartListQuantity: that.data.shoppingCartListQuantity - 1,
    }, () => {
      let shoppingCartList = that.data.shoppingCartList;
      for (let i = 0; i < shoppingCartList.length; i++) {
        if (shoppingCartList[i].cindex == cindex && shoppingCartList[i].iindex == iindex) {
          console.log('shoppingCartList[i].data.quantity', shoppingCartList[i].data.quantity);
          if (shoppingCartList[i].data.quantity == 0) {
            //数量为0时，移除
            shoppingCartList.splice(i, 1);
            //购物车列表为0时，关闭购物车列表和隐藏购物车tabBar
            if (shoppingCartList.length == 0) {
              that.showOrCloseShoppingCart(false);
              that.setData({
                isShoppingCartTabShow: false,
                contentScrollViewHeight: myData.windowHeight - myData.headViewHeight,
              });
            }
            //更新购物车列表数据
            that.setData({
              shoppingCartList,
            });
          } else {
            let sQuantity = "shoppingCartList[" + i + "].data.quantity";
            that.setData({
              [sQuantity]: shoppingCartList[i].data.quantity, //共享地址指向，只需要更新即可，不用-1
            });
          }
          break;
        }
      }
    });
  },

  // 去结算
  toSettlement(e) {
    wx.navigateTo({
      url: '../orderSettlement/orderSettlement?switchIndex=' + that.data.switchIndex,
    })
  },

  // 关注门店
  onFollow(e) {
    console.log("onFollow", e);
    var encryptedData = e.detail.encryptedData
    var iv = e.detail.iv
    const url = "https://api.sanyitest.com/linker/gateway?method=WxMiniAppUser.DecryptData&id=123"
    let token = ""
    try {
      var value = wx.getStorageSync(storageUtil.login)
      if (value) {
        token = value
      }
    } catch (e) {

    }
    const body = {
      encryptedData: encryptedData,
      iv: iv,
      token: token,
      appId: util.getAppId()
    }
    console.log("onFollow body", body)
    util.request(url, body, "POST").then(res => {
      console.log("onFollow success", res)
    }).catch(err => {
      console.log("onFollow fail", err)
    });
  },

  //选择其他门店
  onFollowOther(e) {
    console.log("onFollowOther", e);
  },
})

var myData = {
  onPageScrollTop: 0,
  scrollItemHeightList: [],
  windowHeight: 0, //window的高度
  headViewHeight: 0, //头部view的高度
  shoppingCartTabHeight: 0, //购物车tab的高度
}

// 做法
let cookMethod = [{
  id: 105561,
  name: "低卡",
  price: 5,
  sel: true
}, {
  id: 105459,
  name: "名字很长很长",
  price: 2,
  sel: false
}, {
  id: 105160,
  name: "正常",
  price: 3,
  sel: true
}, {
  id: 10560,
  name: "爆炒",
  price: 3,
  sel: false
}, {
  id: 103560,
  name: "只道寻常",
  price: 3,
  sel: true
}]

// 加料
let ingredient = [{
  id: 1062661,
  name: "布丁",
  price: 5,
  sel: true
}, {
  id: 1023659,
  name: "加料",
  price: 2,
  sel: false
}, {
  id: 102660,
  name: "红豆",
  price: 3,
  sel: false
}, {
  id: 648460,
  name: "紫菜",
  price: 3,
  sel: true
}]

// 多维度
let attributes = [{
  id: 10031,
  name: "温度",
  value: [{
    id: 100310,
    name: "常温",
    sel: false
  }, {
    id: 100311,
    name: "加热",
    sel: false
  }, {
    id: 100312,
    name: "低温冷藏",
    sel: false
  }]
}, {
  id: 20032,
  name: "分量",
  value: [{
    id: 200320,
    name: "小份",
    sel: false
  }, {
    id: 200321,
    name: "中份",
    sel: false
  }, {
    id: 200322,
    name: "大份",
    sel: false
  }]
}, ]

let goodsList = [{
  goods: [{
    categoryId: 15743,
    dateAdd: "2018-01-03 15:15:37",
    dateStart: "2018-01-03 15:04:44",
    dateUpdate: "2019-07-04 17:41:49",
    id: 60453, //菜品id
    minPrice: "10.00",
    name: "冠友土柚约4斤/个",
    originalPrice: "12.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/01/678707df7459d61a05dff8517692d027.jpg",
    price: "10.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0, //0直接添加，1多规格
    isSoldout: false,
  }, {
    categoryId: 15743,
    dateAdd: "2017-12-25 20:20:32",
    dateStart: "2017-12-31 20:16:23",
    dateUpdate: "2019-07-04 18:44:57",
    id: 60398,
    minPrice: "15.00",
    name: "闽和三红柚 (约4斤/个)",
    originalPrice: "20.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/23/aa89448204cd9676d6d4e874aaf053ae.jpg",
    price: "15.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15743,
    dateAdd: "2017-12-27 11:16:15",
    dateStart: "2018-01-01 11:08:59",
    dateUpdate: "2019-07-04 17:11:45",
    id: 60419,
    minPrice: "5.00",
    name: "砂糖桔",
    originalPrice: "8.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/07e22149ff0943ce1ba0452c46db064a.jpg",
    price: "5.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: true,
  }, {
    categoryId: 15743,
    dateAdd: "2017-12-27 11:04:43",
    dateStart: "2017-12-27 11:03:26",
    dateUpdate: "2019-07-04 17:11:45",
    id: 60418,
    minPrice: "3.00",
    name: "广西贡桔",
    originalPrice: "4.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/68312216865c6246cf270e0fd9ae8c87.jpg",
    price: "3.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 1,
    isSoldout: true,
  }, {
    categoryId: 15743,
    dateAdd: "2017-12-26 21:09:06",
    dateStart: "2017-12-26 21:01:51",
    dateUpdate: "2019-07-04 17:02:44",
    id: 60417,
    minPrice: "5.00",
    name: "南丰蜜桔",
    originalPrice: "6.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/12/5303ec2f790426196d1add766e4ad317.jpg",
    price: "5.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 1,
    isSoldout: false,
  }, {
    categoryId: 15743,
    dateAdd: "2017-12-27 14:26:11",
    dateStart: "2017-12-27 14:24:14",
    dateUpdate: "2019-07-04 17:53:51",
    id: 60426,
    minPrice: "7.00",
    name: "金桔",
    originalPrice: "9.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/b46a44526cbaeaa386d7793336e1f1a1.jpg",
    price: "7.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 1,
    isSoldout: false,
  }],
  id: 15743,
  key: "001",
  name: "柑橘",
}, {
  goods: [{
    categoryId: 15742,
    dateAdd: "2018-01-10 15:19:03",
    dateStart: "2018-01-10 15:05:13",
    dateUpdate: "2019-07-04 18:26:54",
    id: 60462,
    minPrice: "12.00",
    name: "板栗(熟）",
    originalPrice: "15.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/10/ebb1129f26d6a5968fcb81cc19055e41.jpg",
    price: "12.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15742,
    dateAdd: "2017-12-27 14:34:25",
    dateStart: "2017-12-27 14:26:30",
    dateUpdate: "2019-07-04 17:36:48",
    id: 60427,
    minPrice: "5.00",
    name: "烟台富士",
    originalPrice: "8.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/7ab6b4d2a794543489bc200cb3fe9380.jpg",
    price: "5.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15742,
    dateAdd: "2017-12-28 16:50:13",
    dateStart: "2017-12-28 16:34:46",
    dateUpdate: "2019-07-04 17:03:44",
    id: 60444,
    minPrice: "5.00",
    name: "纸加膜富士",
    originalPrice: "6.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/10/d3d04553e93d6db85f176235e95c8df3.jpg",
    price: "5.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15742,
  key: "002",
  name: "核果",
}, {
  goods: [{
    categoryId: 15741,
    dateAdd: "2018-01-03 15:45:08",
    dateStart: "2018-01-03 15:42:51",
    dateUpdate: "2019-07-04 17:21:46",
    id: 60457,
    minPrice: "2.50",
    name: "广西甘蔗",
    originalPrice: "3.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/01/c957d6a5729702620e21a864f11d2cfc.png",
    price: "2.50",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15741,
    dateAdd: "2017-12-27 21:35:33",
    dateStart: "2017-12-27 21:28:23",
    dateUpdate: "2019-07-04 17:00:43",
    id: 60438,
    minPrice: "10.00",
    name: "海南菠萝 (约3斤/个)",
    originalPrice: "15.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/10/1bb91edf0b8e26c3aff1b9d8c464297c.jpg",
    price: "10.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15741,
    dateAdd: "2017-12-27 15:51:51",
    dateStart: "2017-12-27 15:45:13",
    dateUpdate: "2019-07-04 11:26:04",
    id: 60431,
    minPrice: "12.00",
    name: "芒果",
    originalPrice: "14.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/47ea35871876545d46edbd95ffb494d4.jpg",
    price: "12.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15741,
  key: "003",
  name: "浆果",
}, {
  goods: [{
    categoryId: 15744,
    dateAdd: "2018-01-03 15:26:33",
    dateStart: "2018-01-03 15:18:19",
    dateUpdate: "2019-07-04 17:18:46",
    id: 60454,
    minPrice: "10.00",
    name: "进口桂圆大",
    originalPrice: "12.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/01/9a5b5597ccbd65e506dfedb7bbaee7f7.png",
    price: "10.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15744,
    dateAdd: "2017-11-27 10:06:23",
    dateStart: "2017-11-27 10:03:32",
    dateUpdate: "2019-07-04 16:45:41",
    id: 60384,
    minPrice: "3.50",
    name: "白心火龙果 (约1.5斤/个)",
    originalPrice: "5.00",
    pic: "https://cdn.it120.cc/apifactory/2017/11/29/9366836238f9a2cb37c61f5df54db6b6.jpg",
    price: "3.50",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15744,
  key: "004",
  name: "仁果",
}, {
  goods: [{
    categoryId: 15745,
    dateAdd: "2017-12-28 13:06:23",
    dateStart: "2017-12-28 13:04:24",
    dateUpdate: "2019-06-28 09:09:24",
    id: 60442,
    minPrice: "18.00",
    name: "麒麟西瓜 (8~10斤/个)",
    originalPrice: "22.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/c44c33df7970ea2b79f474a70c956134.jpg",
    price: "18.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15744,
    dateAdd: "2017-11-27 10:06:23",
    dateStart: "2017-11-27 10:03:32",
    dateUpdate: "2019-07-05 09:17:47",
    id: 60384,
    minPrice: "3.50",
    name: "白心火龙果 (约1.5斤/个)",
    originalPrice: "5.00",
    pic: "https://cdn.it120.cc/apifactory/2017/11/29/9366836238f9a2cb37c61f5df54db6b6.jpg",
    price: "3.50",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15745,
  key: "004",
  name: "仁果",
}, {
  goods: [{
    categoryId: 15745,
    dateAdd: "2017-12-27 20:50:04",
    dateStart: "2017-12-27 20:48:48",
    dateUpdate: "2019-07-04 19:02:59",
    minPrice: "15.00",
    name: "越南黑美人 (约4斤/个)",
    originalPrice: "18.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/90df2ee8e41201e971f7ec6c4ba02031.jpg",
    price: "15.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15745,
    dateAdd: "2017-12-27 20:50:04",
    dateStart: "2017-12-27 20:48:48",
    dateUpdate: "2019-07-04 23:09:24",
    id: 60432,
    minPrice: "15.00",
    name: "越南黑美人 (约4斤/个)",
    originalPrice: "18.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/90df2ee8e41201e971f7ec6c4ba02031.jpg",
    price: "15.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15745,
  key: "005",
  name: "瓜果",
  type: "",
}, {
  goods: [{
    categoryId: 15746,
    dateAdd: "2018-01-04 13:44:34",
    dateStart: "2018-01-04 13:33:42",
    dateUpdate: "2019-07-04 09:55:52",
    id: 60458,
    minPrice: "15.00",
    name: "香妃葡萄干（300g/袋）",
    originalPrice: "18.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/10/a3df87b357a1d7896d407e7d40c015d2.jpg",
    price: "15.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15746,
    dateAdd: "2017-12-30 13:21:11",
    dateStart: "2017-12-30 13:16:14",
    dateUpdate: "2019-07-04 10:34:57",
    id: 60448,
    minPrice: "18.00",
    name: "黑加仑葡萄干 (300g/袋)",
    originalPrice: "20.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/10/c40c5a8e6b53a298802a5052192f63ff.jpg",
    price: "18.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15746,
    dateAdd: "2017-12-25 16:30:35",
    dateStart: "2017-12-25 16:25:17",
    dateUpdate: "2019-07-04 17:21:47",
    id: 60391,
    minPrice: "12.00",
    name: "新疆葡萄干 (300g/袋)",
    originalPrice: "15.00",
    pic: "https://cdn.it120.cc/apifactory/2018/01/10/3f8d032b505a56c07e259d4cf2b04a24.jpg",
    price: "12.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15746,
  key: "006",
  name: "干果",
  type: "",
}, {
  goods: [{
    categoryId: 15747,
    dateAdd: "2017-12-28 13:13:49",
    dateStart: "2017-12-28 13:11:08",
    dateUpdate: "2019-07-01 17:20:51",
    id: 60443,
    minPrice: "4.00",
    name: "马蹄",
    originalPrice: "6.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/a96558e9e9595e487fdaa35a71d26f16.jpg",
    price: "4.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15747,
    dateAdd: "2017-12-27 14:57:16",
    dateStart: "2017-12-27 14:55:39",
    dateUpdate: "2019-07-05 10:49:57",
    id: 60429,
    minPrice: "8.00",
    name: "进口去皮甘蔗",
    originalPrice: "10.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/27/ebbf3f128e9131d094ffe7a64d5badbf.jpg",
    price: "8.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15747,
    dateAdd: "2017-12-25 16:43:13",
    dateStart: "2017-12-25 16:35:39",
    dateUpdate: "2019-07-04 10:38:58",
    id: 60392,
    minPrice: "5.00",
    name: "酒枣（300g）/袋",
    originalPrice: "8.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/23/ff2eaf2388daa086c1c0f9227e852427.jpg",
    price: "5.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }, {
    categoryId: 15747,
    dateAdd: "2017-12-25 19:20:10",
    dateStart: "2017-12-25 19:10:54",
    dateUpdate: "2019-07-02 17:12:05",
    id: 60394,
    minPrice: "8.00",
    name: "金丝蜜枣",
    originalPrice: "10.00",
    pic: "https://cdn.it120.cc/apifactory/2017/12/23/2bfb676cbffa5e70b5e6ee573410a176.jpg",
    price: "8.00",
    desc: '时令季节的云南鲜笋，配上新西云南鲜笋，重磅推荐新品，值得一试',
    type: 0,
    isSoldout: false,
  }],
  id: 15747,
  key: "007",
  name: "其他",
  type: "",
}]