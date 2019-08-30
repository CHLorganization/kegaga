//app.js
const util = require('./utils/util.js');//工具类
const translate = require('./utils/translate.js');//翻译工具类

wx.translate = translate.translate;//国际化方法(到时候这要放到从后台读取得请求里)
wx.themeSkin = '#58C63E';//全局主题色(到时候这要放到从后台读取得请求里)
wx.setNavtitle = util.setNavtitle;

App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    util.login();

    // wx.request({
    //   url: 'https://api.sanyitest.com/linker/gateway?method=WxMiniApp.SignUp&id=123',
    //   method: "POST",
    //   data: {
    //     code: "081BZoOm0bS7ol1z0aQm0S1bOm0BZoOH",
    //     appId: "wxb1fc6145dae64515",
    //   },
    //   success: res => {
    //     console.log("login,success res= ", res);
    //   },
    //   fail: res => {
    //     console.log("login,fail res= ", res);
    //   }
    // })

    // wx.login({
    //   success: res => {
    //     console.log("login,success res= ", res);
    //   }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },

  globalData: {
    themeColorName: "b" /*主题颜色名字*/ ,
    themeColor: "#74C2C8" /*主题颜色*/ ,
    subDomain: "tggtest",
    appId:"wxb1fc6145dae64515",
  }
})