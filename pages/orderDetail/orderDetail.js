// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisOrder:{},
    isRefundDialogShow: false,
  },
  onShow: function () {
    wx.setNavtitle("订单详情","#000000","#FFFFFF");

  },
  onLoad: function (options) {
    if( options.thisOrder ){
      this.setData({
        thisOrder: JSON.parse(options.thisOrder)
      },()=>{
        console.log(this.data.thisOrder);
      })
    }else{
      let that = this;
      wx.getStorage({
        key: 'thisOrder',
        success(res) {
          that.setData({
            thisOrder: JSON.parse(res.data)
          })
          console.log(that.data.thisOrder);
          
        }
      })
    }
    
  },

  // 显示/隐藏 退款弹窗
  showRefundDialog() {
    var that = this;
    that.showOrCloseDialog(!that.data.isRefundDialogShow);
  },

  // 退款弹窗 动画
  showOrCloseDialog(boolValue) {
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
        isRefundDialogShow: boolValue,
      });
    }, 200);
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  //退款操作
  onRefund(e) {
    var that = this;
    that.showOrCloseDialog(!that.data.isRefundDialogShow);
    wx: wx.navigateTo({
      url: '../refund/refund',
    })
  },

  // 消费touchMove事件
  catchtouchmove() { },

})