const urlUtil = require("./urlUtil.js");
const storageUtil = require("./storageUtil.js");

module.exports = {

  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  /**
   * request
   */
  request(url, data = {}, method = "GET") {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'Content-Type': 'application/json',
        },
        success(res) {
          console.log("success");
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail(err) {
          reject(err)
          console.log("request failed")
        }
      })
    });
  },


  // 检查登录态是否过期，过期重新登录
  checkSession() {
    const that = this
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('checkSession  success')
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        that.login()
      }
    })
  },

  login() {
    const that = this
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          that.request(urlUtil.login, {
            code: res.code,
            appId: that.getAppId()
          }, "POST").then(res => {
            console.log("login res", res);
            console.log("login res.data", res.data);
            const data = res.data;
            storageUtil.setStorage(storageUtil.login, data);
          }).catch(err => {
            that.login();
            console.log("login,success fail res= ", res.data.message);
          });
        } else {
          console.log('登录失败！' + res.errMsg)
          that.login();
        }
      }
    })
  },

  // 获取小程序 appId
  getAppId() {
    try {
      if (wx.getAccountInfoSync) {
        const accountInfo = wx.getAccountInfoSync();
        return accountInfo.miniProgram.appId;
      } else {
        return "wxb1fc6145dae64515"
      }
    } catch (e) {
      console.log("util->getAppId:", e)
    }
  },

  //返回屏幕高度
  getWindowHeight() {
    try {
      var res = wx.getSystemInfoSync();
      return res.windowHeight;
    } catch (e) {
      console.log("util->getWindowHeight:", e)
    }
  },

  setNavtitle(text, color, bgColor) { //自定义更改标题栏
    wx.setNavigationBarTitle({
      title: text
    });

    wx.setNavigationBarColor({
      frontColor: color ? color : "#000000",
      /*标题颜色，这里貌似仅支持 #ffffff 和 #000000 */
      backgroundColor: bgColor ? bgColor : "#F4F4F4",
      /*背景色 十六进制即可*/
      // animation: {/*动画*/
      //   duration: 100,
      //   timingFunc: 'easeIn'
      // }
    })
  },

  getUserLocation(callBack) {
    const that = this
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation(callBack);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation(callBack);
        } else {
          //调用wx.getLocation的API
          that.getLocation(callBack);
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation(callBack) {
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        callBack(res);
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },

  //返回当前地理位置
  getCurrentLocation(qqmapsdk, callBack) {
    const that = this
    that.getUserLocation((res) => {
      that.getLocal(qqmapsdk, callBack, res.latitude, res.longitude)
    })
  },

  // 获取当前地理位置
  getLocal(qqmapsdk, callBack, latitude, longitude) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        callBack(res)
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },

  //获得计算距离
  getDistance(qqmapsdk, locationList, callBack) {
    console.log('getDistance locationList', JSON.stringify(locationList));
    qqmapsdk.calculateDistance({
      mode: 'straight', //可选值：'driving'（驾车）、'walking'（默认步行），'straight'(直线距离)，不填则默认
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      to: [{
        latitude: locationList[0].latitude,
        longitude: locationList[0].longitude
      }, {
        latitude: locationList[1].latitude,
        longitude: locationList[1].longitude
      }, {
        latitude: locationList[2].latitude,
        longitude: locationList[2].longitude
      }, {
        latitude: locationList[3].latitude,
        longitude: locationList[3].longitude
      }, {
        latitude: locationList[4].latitude,
        longitude: locationList[4].longitude
      }, {
        latitude: locationList[5].latitude,
        longitude: locationList[5].longitude
      }], //终点坐标
      success: function(res) { //成功后的回调
        console.log('getDistance success', res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        callBack(dis);
      },
      fail: function(error) {
        console.log('getDistance fail', error);
      },
      complete: function(res) {
        console.log('getDistance fail', res);
      }
    });
  },

}