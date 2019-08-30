var app = getApp();

module.exports = {

  historyKeyList:"historyKeyList",
  historyLable:"historyLable",
  address:"address",
  remark:"remark",
  login:"login",


  setStorage(key, value) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: value,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  },

  getStorageSync(key) {
    return new Promise((resolve, reject) => {
      try {
        var value = wx.getStorageSync(key)
        if (value) {
          resolve(value)
        }
      } catch (e) {
        reject(e);
      }
    });
  },

  getStorage(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  },

// 从本地缓存中移除指定 key
  removeStorage(key) {
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key: key,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  },

}