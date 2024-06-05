/**
 * @description define exportCsvType 匯出 CSV 類型
 */
const exportCsvType = Object.freeze({
  memberInfo: 'memberInfo', //會員資料
  memberTag: 'memberTag', //會員標籤
  orderDetail: 'orderDetail', //消費紀錄
  pointLog: 'pointLog', //積點明細
  couponDetail: 'couponDetail', //優惠券明細
  commodityDetail: 'commodityDetail', //商品券明細
  rewardDetail: 'rewardDetail', //集點卡明細
  ECVoucher: 'ECVoucher' //電子票券紀錄
});

export default exportCsvType;
