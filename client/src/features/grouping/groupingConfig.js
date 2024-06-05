const clusterType = {
  basic: 'basic',
  memberActivities: 'memberActivities',
  consume: 'consume'
};

const mainType = {
  userData: 'userData',
  memberShip: 'memberShip',
  point: 'point',
  activityLevel: 'activityLevel',
  memberInteraction: 'memberInteraction',
  tags: 'tags',
  booking: 'booking',
  discountCoupon: 'discountCoupon',
  commodityCoupon: 'commodityCoupon',
  rewardCard: 'rewardCard',
  consumptionStatistics: 'consumptionStatistics'
};

const subType = {
  gender: 'gender',
  age: 'age',
  birthdayMonth: 'birthdayMonth',
  address: 'address',
  registrationChannel: 'registrationChannel',
  registrationDate: 'registrationDate',
  openChannel: 'openChannel',
  unOpenChannel: 'unOpenChannel',
  specialMemberType: 'specialMemberType',
  memberShip: 'memberShip',
  memberShipUpgradeDate: 'memberShipUpgradeDate',
  memberShipExpiredDate: 'memberShipExpiredDate',
  upgradeDiffAmount: 'upgradeDiffAmount',
  upgradeDiffCount: 'upgradeDiffCount',
  pointActivity: 'pointActivity',
  lastPoint: 'lastPoint',
  pointExpiredDate: 'pointExpiredDate',
  usedPoint: 'usedPoint',
  usedPointDate: 'usedPointDate',
  mainMember: 'mainMember',
  drowsyMember: 'drowsyMember',
  sleepyMember: 'sleepyMember',
  lostMember: 'lostMember',
  memberSignIn: 'memberSignIn',
  signInChannel: 'signInChannel',
  referrerPeople: 'referrerPeople',
  pointUse: 'pointUse',
  discountWriteOff: 'discountWriteOff',
  commodityWriteOff: 'commodityWriteOff',
  rewardCardRedeem: 'rewardCardRedeem',
  memberTag: 'memberTag',
  useTagDate: 'useTagDate',
  bookingBrand: 'bookingBrand',
  bookingStore: 'bookingStore',
  bookingPeople: 'bookingPeople',
  bookingCount: 'bookingCount',
  notCheckInCount: 'notCheckInCount',
  mealDate: 'mealDate',
  receivedDiscountCount: 'receivedDiscountCount',
  validDiscountCount: 'validDiscountCount',
  discountExpirationDate: 'discountExpirationDate',
  writeOffDiscountCoupon: 'writeOffDiscountCoupon',
  writeOffDiscountCouponCount: 'writeOffDiscountCouponCount',
  writeOffDiscountCouponDate: 'writeOffDiscountCouponDate',
  commodityCoupon: 'commodityCoupon',
  commodityCouponExpiredDate: 'commodityCouponExpiredDate',
  writeOffCommodityCoupon: 'writeOffCommodityCoupon',
  writeOffStore: 'writeOffStore',
  writeOffCommodityCouponDate: 'writeOffCommodityCouponDate',
  notWriteOffCommodityCoupon: 'notWriteOffCommodityCoupon',
  rewardCard: 'rewardCard',
  rewardCardDiffPoint: 'rewardCardDiffPoint',
  receivedRewardCard: 'receivedRewardCard',
  receivedRewardCardPoint: 'receivedRewardCardPoint',
  redeemedRewardCardDate: 'redeemedRewardCardDate',
  orderChannel: 'orderChannel',
  orderBrand: 'orderBrand',
  orderStore: 'orderStore',
  orderDate: 'orderDate',
  orderPeople: 'orderPeople',
  orderMealDate: 'orderMealDate',
  orderCommodity: 'orderCommodity',
  orderCount: 'orderCount',
  orderOriginalAmount: 'orderOriginalAmount',
  orderPaidAmount: 'orderPaidAmount',
  discountCount: 'discountCount',
  discountAmount: 'discountAmount',
  discountPointCount: 'discountPointCount',
  discountPoint: 'discountPoint',
  cancelReturnDate: 'cancelReturnDate',
  cancelReturnCount: 'cancelReturnCount',
  cancelReturnAmount: 'cancelReturnAmount',
  delivery: 'delivery',
  payment: 'payment',
  cityZip: 'cityZip',
  addressCity: 'addressCity',
  addressZip: 'addressZip'
};

/* --------- 下拉式選項------------ */

/* gender - 性別 */
const genderOptions = _generateOptions([
  ['M', '男'],
  ['F', '女'],
  ['S', '保密']
]);
/* date - 日期 */
const dateOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1} 月`
}));

/* 區間 */
const conditionOptions = _generateOptions([
  ['greater', '>'],
  ['greaterEqual', '≥'],
  ['equal', '='],
  ['less', '<'],
  ['lessEqual', '≤']
]);
/* 主分類 */

const groupingOptions = _generateOptions([
  ['basic', '基本資料'],
  ['memberActivities', '會員活動'],
  ['consume', '消費行為']
]);

/* 次分類 */
const mainTypeCategory = {
  basic: _generateOptions([['userData', '會員資料']]),
  memberActivities: _generateOptions([
    ['memberShip', '會籍'],
    ['point', '積點'],
    ['activityLevel', '活躍度'],
    ['memberInteraction', '會員互動'],
    ['tags', '標籤'],
    ['booking', '訂位'],
    ['discountCoupon', '優惠券'],
    ['commodityCoupon', '商品券'],
    ['rewardCard', '集點卡']
  ]),
  consume: _generateOptions([['consumptionStatistics', '消費統計']])
};

/* 子分類 */
const typeCategory = {
  /* A1 會員資料 */
  userData: _generateOptions([
    ['gender', '性別'],
    ['age', '年齡'],
    ['birthdayMonth', '生日月份'],
    ['address', '居住地'],
    ['registrationChannel', '註冊渠道'],
    ['registrationDate', '註冊日期'],
    ['openChannel', '開通渠道'],
    ['unOpenChannel', '未開通渠道'],
    ['specialMemberType', '特殊會員類型']
  ]),
  /* B1 會籍*/
  memberShip: _generateOptions([
    ['memberShip', '會員會籍'],
    ['memberShipUpgradeDate', '會籍晉升日'],
    ['memberShipExpiredDate', '會籍到期日'],
    ['upgradeDiffAmount', '升等消費差額'],
    ['upgradeDiffCount', '升等消費差異次數']
  ]),
  /* B2 積點*/
  point: _generateOptions([
    ['pointActivity', '積點活動達成'],
    ['lastPoint', '有效剩餘積點'],
    ['pointExpiredDate', '積點到期日'],
    ['usedPoint', '已使用積點'],
    ['usedPointDate', '使用積點日期']
  ]),
  /* B3 活躍度 */
  activityLevel: _generateOptions([
    ['mainMember', '主力會員'],
    ['drowsyMember', '瞌睡會員'],
    ['sleepyMember', '沉睡會員'],
    ['lostMember', '流失會員']
  ]),
  /* B4 會員互動 */
  memberInteraction: _generateOptions([
    ['memberSignIn', '會員互動'],
    ['signInChannel', '互動渠道'],
    ['referrerPeople', '推薦人數'],
    ['pointUse', '積點使用'],
    ['discountWriteOff', '優惠券核銷'],
    ['commodityWriteOff', '商品券核銷'],
    ['rewardCardRedeem', '集點卡兌換']
  ]),
  /* B5. 標籤 */
  tags: _generateOptions([
    ['memberTag', '會員標籤'],
    ['useTagDate', '貼標日期']
  ]),
  /* B6. 訂位 */
  booking: _generateOptions([
    ['bookingBrand', '訂位品牌'],
    ['bookingStore', '訂位門市'],
    ['bookingPeople', '訂位人數'],
    ['bookingCount', '訂位次數'],
    ['notCheckInCount', '未報到次數'],
    ['mealDate', '用餐日期']
  ]),
  /* B7. 優惠券 */
  discountCoupon: _generateOptions([
    ['receivedDiscountCount', '已領取優惠券'],
    ['validDiscountCount', '有效優惠券數量'],
    ['discountExpirationDate', '優惠券到期日'],
    ['writeOffDiscountCoupon', '已核銷優惠券'],
    ['writeOffDiscountCouponCount', '已核銷優惠券數量'],
    ['writeOffDiscountCouponDate', '核銷優惠券日期']
  ]),
  /* B8. 商品券*/
  commodityCoupon: _generateOptions([
    ['commodityCoupon', '待核銷商品券'],
    ['commodityCouponExpiredDate', '待核銷商品券到期日'],
    ['writeOffCommodityCoupon', '已核銷商品券'],
    ['writeOffStore', '核銷門市'],
    ['writeOffCommodityCouponDate', '核銷商品券日期'],
    ['notWriteOffCommodityCoupon', '逾期未核銷商品券']
  ]),
  /* B9. 集點卡*/
  rewardCard: _generateOptions([
    ['rewardCard', '累點中集點卡'],
    ['rewardCardDiffPoint', '累點中集點卡差異點數'],
    ['receivedRewardCard', '已兌換集點卡'],
    ['receivedRewardCardPoint', '已兌換集點卡點數'],
    ['redeemedRewardCardDate', '兌換集點卡日期']
  ]),
  /* C1 消費統計 */
  consumptionStatistics: _generateOptions([
    ['orderChannel', '消費來源'],
    ['orderBrand', '消費品牌'],
    ['orderStore', '消費門市'],
    ['orderDate', '消費日期'],
    ['orderPeople', '消費人數'],
    ['orderMealDate', '消費餐期'],
    ['orderCommodity', '消費商品'],
    ['orderCount', '累計消費次數'],
    ['orderOriginalAmount', '累計原始訂單金額'],
    ['orderPaidAmount', '累計實際消費金額'],
    ['discountCount', '累計折扣次數'],
    ['discountAmount', '累計折扣金額'],
    ['discountPointCount', '累計折抵點數次數'],
    ['discountPoint', '累計折抵點數'],
    ['cancelReturnDate', '取消退貨日期'],
    ['cancelReturnCount', '取消退貨次數'],
    ['cancelReturnAmount', '取消退貨金額'],
    ['delivery', '宅配縣市區域'],
    ['payment', '支付方式']
    // ['addressCity', '居住地-縣市'],
    // ['addressZip', '居住地-區域']
  ])
};

const typeOptions = {};

export {
  clusterType,
  mainType,
  subType,
  genderOptions,
  dateOptions,
  groupingOptions,
  mainTypeCategory,
  typeCategory,
  typeOptions,
  conditionOptions
};

/* helper function */
function _generateOptions(arr) {
  return arr.map((ele) => ({ value: ele[0], label: ele[1] }));
}
