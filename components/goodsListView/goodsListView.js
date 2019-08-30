// components/goodsListView/goodsListView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentOrder: Object,
    ListViewType: Number//商品信息列表的订单类型，0为未结算订单，1为已结算订单
  },

  /**
   * 组件的初始数据
   */
  data: {
    staticText: wx.translate.staticText.components.goodsListView,//国际化从translate中取翻译过的文本
    surCharge_bgColor: wx.themeSkin
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
