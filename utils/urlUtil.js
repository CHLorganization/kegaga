var app = getApp();
const util = require('./util.js');//工具类
const baseUrl = "https://sk.sanyitest.com"

module.exports = {
// 用code换取openId
  login: 'https://api.sanyitest.com/linker/gateway?method=WxMiniApp.SignUp&id=123',

  // 根据appId查询品牌信息
  get_brandinfo_by_appid: baseUrl + "/shunke/memberRunning/get_brandinfo_by_appid",

  // 查询当前登录着的会员信息(亦可判断是否会员)
  loginMember(brandId, weixinOpenId) {
    return baseUrl + `/shunke/memberRunning/memberBaseInfo/loginMember/${brandId}/${weixinOpenId}`
  },

  // 查询注册时的门店列表
  get_shops(brandId) {
    return baseUrl + `/shunke/memberRunning/${brandId}/get_shops`
  },

  // 注册成为会员
  create_member: baseUrl + "/shunke/memberRunning/memberBaseInfo/create_member",

  // 修改会员信息
  update_member: baseUrl + "/shunke/memberRunning/memberBaseInfo/update_member",

  // 新增会员收货地址
  create_shipping_address: baseUrl + "/shunke/memberRunning/memberBaseInfo/create_shipping_address",

  // 查询当前会员收货地址列表
  get_shipping_address(memberId){
    return baseUrl + `/shunke/memberRunning/memberBaseInfo/${memberId}/get_shipping_address`
  },

  // 修改会员收货地址
  update_shipping_address: baseUrl + "/shunke/memberRunning/memberBaseInfo/update_shipping_address",

  // 删除会员收货地址
  delAddr(addressId){
    return baseUrl + `/shunke/memberRunning/memberBaseInfo/${addressId}/delete_shipping_address`
  },

  // 修改消费密码
  update_password: baseUrl + "/shunke/memberRunning/memberBaseInfo/update_password",

  // 查询会员个人信息和资产信息（不包含券）
  findMemberWithAssets(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberAssetsRights/${brandId}/findMemberWithAssets/${memberId}`
  },

  // 查询会员的券列表（可用和不可用）
  findMemberWithCoupon(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberAssetsRights/${brandId}/findMemberWithCoupon/${memberId}`
  },

  // 查询当前会员的权益列表
  findMemberWithRights(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberAssetsRights/${brandId}/findMemberWithRights/${memberId}`
  },

// 查询当前会员的储值权益列表
  findMemberWithSaveRights(brandId, memberId, isSaveMoney) {
    return baseUrl + `/shunke/memberRunning/memberAssetsRights/${brandId}/findMemberWithRights/${memberId}/${isSaveMoney}`
  },

  // 查询会员储值记录
  saveMoney(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberRecords/${brandId}/saveMoney/${memberId}`
  },

  // 查询会员消费记录（所有验证过会员的订单消费）
  consume(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberRecords/${brandId}/consume/${memberId}`
  },

  // 查询会员的等级变更记录
  riseLevel(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberRecords/${brandId}/riseLevel/${memberId}`
  },

  // 查询会员余额变更记录
  moneyChange(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberRecords/${brandId}/moneyChange/${memberId}`
  },

  // 查询会员积分变更记录
  pointsChange(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberRecords/${brandId}/pointsChange/${memberId}`
  },

  // 查询会员成长值变更记录
  growthChange(brandId, memberId) {
    return baseUrl + `/shunke/memberRunning/memberRecords/${brandId}/growthChange/${memberId}`
  },

}