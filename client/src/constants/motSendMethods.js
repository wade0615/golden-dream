/**
 * @description define ＭOT 發送方法
 */
const motSendMethods = Object.freeze({
  APP: 'app',
  SMS: 'sms',
  EMAIL: 'email',
  NO_SMS: 'noSms', //會員可接收 APP 推播，即不發送簡訊
  NEGLECT_MAX_COUNT: 'neglectCount' //忽略會員每月接收推播上限次數
});

export default motSendMethods;
