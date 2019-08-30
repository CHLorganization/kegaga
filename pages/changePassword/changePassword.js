// pages/changePassword.js

Page({
  data: {
    order: 0,//输入密码进行到哪一步
    isFocus: true, //聚焦
    password: "", //输入的内容
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled: true,
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
    if (ilen == 6) {
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
    if (that.data.order === 0){
      //检查密码成功，则进行下一步
      if (that.checkPwd()){
        that.setData({
          order: 1,
          disabled: true,
          password:'',
        })
      }else{
        this.showToast('密码错误，请重试！');
        that.setData({
          password:'',
          disabled: true,
        })
      }
    } else if (that.data.order === 1){
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
        this.showToast('两次输入的密码不一样，请重试！');
        that.setData({
          disabled: true,
          password: '',
        })
      }
    }
  
  },

//检查密码
  checkPwd(){
    return true;
  },

//修改密码
  changePwd(){
    var that = this;
    wx.navigateBack({
      delta: 1
    })
    that.showToast('密码修改成功！');
  },

  showToast(text){
    wx.showToast({
      title: text,
      icon: 'none',
    })
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
  newPassword: '',
}