// pages/label/label.js
var app = getApp();
var storageUtil = require("../../utils/storageUtil.js");
var that = {}
Page({
  data: {
    inputValue: '',
    historyLable: [],
    currentWordNumber: 0,
  },

  onLoad: function(options) {
    that = this;
    that.loadHistoryLable();
    that.getRemark(); //获取备注
    this.setData({
      themeColor: app.globalData.themeColor,
    });
  },

  //加载快捷标签
  loadHistoryLable() {
    storageUtil.getStorage(storageUtil.historyLable).then((res) => {
      that.setData({
        historyLable: res.data,
      });
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.historyLable, []);
    });
  },

  //获取填写的备注
  getRemark() {
    storageUtil.getStorage(storageUtil.remark).then((res) => {
      that.setData({
        inputValue: res.data,
        currentWordNumber: res.data.length,
      });
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.remark, '');
    });
  },

  // 输入监听
  onInput(e) {
    var value = e.detail.value;
    that.setData({
      inputValue: value,
      currentWordNumber: value.length,
    });
  },

  // 清空快捷标签
  emptyLabel(e) {
    if (that.data.historyLable.length > 0) {
      wx.showModal({
        content: '确认清空快捷标签？',
        confirmColor: that.data.themeColor,
        success(res) {
          if (res.confirm) {
            storageUtil.setStorage(storageUtil.historyLable, []);
            that.setData({
              historyLable: []
            });
          } else if (res.cancel) {
            //用户点击取消
          }
        }
      })
    }
  },

  // 选择标签添加进输入框
  selectedLabel(e) {
    var label = e.currentTarget.dataset.label;
    let inputValue = '';
    // 如果inputValue不为空，则后面加逗号分隔
    if (that.data.inputValue) {
      inputValue += that.data.inputValue + '，';
    }
    inputValue += label;
    if (inputValue.length > 50) { //最多只能50个字
      inputValue = inputValue.substr(0, 50);
    }
    that.setData({
      inputValue: inputValue,
      currentWordNumber: inputValue.length,
    });
  },

  // 点击确认
  confirm() {
    const inputValue = that.data.inputValue;
    that.saveInputLable(inputValue);
    storageUtil.setStorage(storageUtil.remark, inputValue);
    wx: wx.navigateBack({
      delta: 1,
    })
  },

  //保存输入的标签
  saveInputLable(label) {
    storageUtil.getStorage(storageUtil.historyLable).then((res) => {
      //如果该label已经存在就无须再保存
      if (res.data.indexOf(label) < 0) {
        res.data.unshift(label);
        if (res.data.length > 5) { //最多只能5个标签
          res.data.length = 5;
        }
        //将label保存在缓存中
        storageUtil.setStorage(storageUtil.historyLable, res.data);
        //更新历史搜索key
        that.setData({
          historyLable: res.data
        });
      }
    }).catch((res) => {
      storageUtil.setStorage(storageUtil.historyLable, []);
    });
  },
});