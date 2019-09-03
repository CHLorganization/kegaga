// pages/changePassword.js
var util = require("../../utils/util.js");
var urlUtil = require("../../utils/urlUtil.js");
Page({
  data: {
    order: 0,//输入密码进行到哪一步
    isFocus: true, //聚焦
    password: "", //输入的内容
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled: true,//是否继续接收输入
  },

  // 接收输入
  onInput(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    that.setData({
      password: inputValue,
    })
    if (ilen == 6) {//密码长度=6时，自动进入下一步
      that.setData({
        disabled: false,
      })
      that.changeStep();
    } else {
      that.setData({
        disabled: true,
      })
    }
  },

//修改步骤
  changeStep(){
    var that = this;
    if (that.data.order === 0){//第一步，当前交易密码
      //检查密码成功，则进行下一步
      if (that.checkPwd()){
        that.setData({
          order: 1,
          disabled: true,
          password:'',
        })
      }else{
        util.showToast('密码错误，请重试！');
        that.setData({
          password:'',
          disabled: true,
        })
      }
    } else if (that.data.order === 1) {//第二步，保存新密码
      //赋值输入的新密码以作保存
      myData.newPassword = that.data.password
      that.setData({
        order: 2,
        disabled: true,
        password:'',
      })
    }else{
      //两次密码相同
      if (myData.newPassword === that.data.password){
        this.changePwd();
      }else{
        util.showToast('两次输入的密码不一样，请重试！');
        that.setData({
          disabled: true,
          password: '',
        })
      }
    }
  
  },

//网络请求检查密码
  checkPwd(){
    return true;
  },

//网络请求修改密码
  changePwd(){
    const that = this;
    const url = urlUtil.update_password;
    let body = {};
    body.id = 5;
    body.oldPsd = "";
    body.newPsd = that.data.password;
    util.request(url, body, "POST").then(res=>{
      if (res.rtnCode === 10000){
        wx.navigateBack({
          delta: 1
        })
        util.showToast('密码修改成功！');
      }else{
        util.showToast('密码修改失败！');
      }
    }).catch(err=>{
      util.showToast('密码修改失败！');
    });
  },

  // 获取焦点
  tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  formSubmit(e) {
    console.log(e.detail.value.password);
  },

  onLoad: function(options) {

  },
  onShow: function() {

  },
})

let myData = {
  newPassword: '',//保存输入的新密码，跟再次输入的新密码做校验
}