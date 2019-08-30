//国际化翻译方法
let translate = {
  language: 'zh_ch',
  NavigationBarTitle:{//标题文本
  },
  TabBar:{//底部tab文本
    order:"点餐",
    takeMeal:"取餐",
    me:"我"
  },
  staticText:{//页面内容文本
    common:{
      currencySign: "¥",
    },
    order:{
      what:"点大餐了"
    },
    takeMeal:{
      currentOrder:"当前订单",
      historyOrder:"历史订单",
      eatInside_Process:['已下单','制作中','可取餐','已取餐'],
      waimai_Process:['已下单','制作中','配送中','已送达'],
      goodsSubtext:["等","件商品"],
      takeNum:"取餐号：",
      cancelOrder:"取消订单",
      confirmReach:"确认收货",
      againlOrder:"再来一单",
      contactShop:"联系商家",
      readDetail:"查看详情",
      tokenMeal:"已取餐",
      havenReach:"已送达",
      willReachTime:["预计","到达"],
      refund:"商家售后退款",
    },
    me:{
      editInfo:'资料修改',
      userInfo:'我的资料',
      editAddress:'地址管理',
    },
    components:{
      goodsListView:{ 
        goodsInfo:'商品信息',
        num:['共','件'],
        packing:'包装费',
        peisong:'配送费',
        preferential:'已优惠',
        WeChatPay:'微信支付',
        totalMoney:'小计',
        mark:'¥'
      },
    }
  },

  // 更改底部tab文本内容
  setTabBar(){
    wx.setTabBarItem({
      index: 0,
      text: this.TabBar.order
    });
    wx.setTabBarItem({
      index: 1,
      text: this.TabBar.takeMeal
    })
    wx.setTabBarItem({
      index: 2,
      text: this.TabBar.me
    })
  }
  


  // //看哪一种逻辑流程就使用哪一套方案
  // locale: null,
  // locales: {},
  // langCode: ['zh-Hans', 'en'],
  // registerLocales: function (locales) {
  //   this.locales = locales;
  // },
  // setLocale: function (code) {
  //   this.locale = code;
  // },
  // setLocaleByIndex: function (index) {
  //   lastLanguageIndex = index;
  //   this.setLocale(this.langCode[index]);
  //   setTabBarLang(index);
  // },
  // getLanguage: function () {
  //   return this.locales[this.locale];
  // },
  // setNavigationBarTitle: function (tab) {
  //   wx.setNavigationBarTitle({
  //     title: tabToNavigationBarTitle[tab][lastLanguageIndex]
  //   });
  // }
};

module.exports = {
  translate: translate
}