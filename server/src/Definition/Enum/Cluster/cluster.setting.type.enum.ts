export enum CLUSTER_SETTING_TYPE {
  /** 分群條件 */
  POSITIVE = 'positive',
  /** 排除條件 */
  NEGATIVE = 'negative'
}

export enum CLUSTER_MAIN_TYPE {
  /** 基本資料 */
  BASIC = 'basic',
  /** 會員活動 */
  MEMBER_ACTIVITIES = 'memberActivities',
  /** 消費行為 */
  CONSUME = 'consume'
}

export enum CLUSTER_EXPORT_STATUS_TYPE {
  /** 即時 */
  IMMEDIATE = 'immediate',
  /** 指定日期 */
  SPECIFIED_DATE = 'specifiedDate',
  /** 每半月 */
  EVERY_HALF_MONTH = 'everyHalfMonth',
  /** 每個月 */
  EVERY_MONTH = 'everyMonth',
  /** 每一季 */
  EVERY_QUARTER = 'everyQuarter',
  /** 指定範圍日期 */
  SPECIFIED_RANGE_DATE = 'specifiedRangeDate',
  /** 每日 */
  EVERY_DAY = 'everyDay'
}

export const CLUSTER_EXPORT_STATUS_TYPE_STR = {
  /** 即時 */
  [CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE]: '即時',
  /** 指定日期 */
  [CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE]: '指定日期',
  /** 每半月 */
  [CLUSTER_EXPORT_STATUS_TYPE.EVERY_HALF_MONTH]: '每半月',
  /** 每個月 */
  [CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH]: '每個月',
  /** 每一季 */
  [CLUSTER_EXPORT_STATUS_TYPE.EVERY_QUARTER]: '每一季',
  /** 指定範圍日期 */
  [CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_RANGE_DATE]: '指定範圍日期',
  /** 每日 */
  [CLUSTER_EXPORT_STATUS_TYPE.EVERY_DAY]: '每日'
};

// conditional
export enum CLUSTER_SETTING_CONDITIONAL_TYPE {
  /** 且 */
  AND = 'AND',
  /** 或 */
  OR = 'OR',
  /** 大於 */
  GREATER = 'greater',
  /** 大於等於 */
  GREATER_EQUAL = 'greaterEqual',
  /** 小於 */
  LESS = 'less',
  /** 小於等於 */
  LESS_EQUAL = 'lessEqual',
  /** 等於 */
  EQUAL = 'equal',
  /** 區間 */
  BETWEEN = 'BETWEEN',
  /** 指定日期 */
  SPECIFY = 'SPECIFY',
  /** 依匯出時間 */
  EXPORT = 'EXPORT'
}

export const CLUSTER_SETTING_CONDITIONAL_TYPE_STR = {
  [CLUSTER_SETTING_CONDITIONAL_TYPE.AND]: 'AND',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.OR]: 'OR',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.GREATER]: '>',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.GREATER_EQUAL]: '>=',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.LESS]: '<',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.LESS_EQUAL]: '<=',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.EQUAL]: '=',
  [CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN]: 'BETWEEN'
};

export enum CLUSTER_SETTING_MAIN_TYPE {
  /** 性別 */
  GENDER = 'gender',
  /** 年齡 */
  AGE = 'age',
  /** 生日月份 */
  BIRTHDAY_MONTH = 'birthdayMonth',
  /** 居住地 */
  ADDRESS = 'address',
  /** 註冊渠道 */
  REGISTRATION_CHANNEL = 'registrationChannel',
  /** 註冊日期 */
  REGISTRATION_DATE = 'registrationDate',
  /** 開通渠道 */
  OPEN_CHANNEL = 'openChannel',
  /** 未開通渠道 */
  UN_OPEN_CHANNEL = 'unOpenChannel',
  /** 特殊會員類型 */
  SPECIAL_MEMBER_TYPE = 'specialMemberType',
  /** 會員會籍 */
  MEMBER_SHIP = 'memberShip',
  /** 會籍晉升日 */
  MEMBER_SHIP_UPGRADE_DATE = 'memberShipUpgradeDate',
  /** 會籍到期日 */
  MEMBER_SHIP_EXPIRED_DATE = 'memberShipExpiredDate',
  /** 升等消費差額 */
  UPGRADE_DIFF_AMOUNT = 'upgradeDiffAmount',
  /** 升等消費差異次數 */
  UPGRADE_DIFF_COUNT = 'upgradeDiffCount',
  /** 積點活動達成 */
  POINT_ACTIVITY = 'pointActivity',
  /** 有效剩餘積點 */
  LAST_POINT = 'lastPoint',
  /** 積點到期日 */
  POINT_EXPIRED_DATE = 'pointExpiredDate',
  /** 已使用積點 */
  USED_POINT = 'usedPoint',
  /** 使用積點日期 */
  USED_POINT_DATE = 'usedPointDate',
  /** 主力會員 */
  MAIN_MEMBER = 'mainMember',
  /** 瞌睡會員 */
  DROWSY_MEMBER = 'drowsyMember',
  /** 沈睡會員 */
  SLEEPY_MEMBER = 'sleepyMember',
  /** 流失會員 */
  LOST_MEMBER = 'lostMember',
  /** 會員互動 */
  MEMBER_SIGN_IN = 'memberSignIn',
  /** 互動渠道 */
  SIGN_IN_CHANNEL = 'signInChannel',
  /** 推薦人數 */
  REFERRER_PEOPLE = 'referrerPeople',
  /** 積點使用 */
  POINT_USE = 'pointUse',
  /** 優惠券核銷 */
  DISCOUNT_WRITE_OFF = 'discountWriteOff',
  /** 商品券核銷 */
  COMMODITY_WRITE_OFF = 'commodityWriteOff',
  /** 集點卡兌換 */
  REWARD_CARD_REDEEM = 'rewardCardRedeem',
  /** 會員標籤 */
  MEMBER_TAG = 'memberTag',
  /** 貼標日期 */
  USE_TAG_DATE = 'useTagDate',
  /** 訂位品牌 */
  BOOKING_BRAND = 'bookingBrand',
  /** 訂位門市 */
  BOOKING_STORE = 'bookingStore',
  /** 訂位人數 */
  BOOKING_PEOPLE = 'bookingPeople',
  /** 訂位次數 */
  BOOKING_COUNT = 'bookingCount',
  /** 未報到次數 */
  NOT_CHECK_IN_COUNT = 'notCheckInCount',
  /** 用餐日期 */
  MEAL_DATE = 'mealDate',
  /** 已領取優惠券 */
  RECEIVED_DISCOUNT_COUNT = 'receivedDiscountCount',
  /** 有效優惠券數量 */
  VALID_DISCOUNT_COUNT = 'validDiscountCount',
  /** 優惠券到期日 */
  DISCOUNT_EXPIRATION_DATE = 'discountExpirationDate',
  /** 已核銷優惠券 */
  WRITE_OFF_DISCOUNT_COUPON = 'writeOffDiscountCoupon',
  /** 已核銷優惠券數量 */
  WRITE_OFF_DISCOUNT_COUPON_COUNT = 'writeOffDiscountCouponCount',
  /** 核銷優惠券日期 */
  WRITE_OFF_DISCOUNT_COUPON_DATE = 'writeOffDiscountCouponDate',
  /** 待核銷商品券 */
  COMMODITY_COUPON = 'commodityCoupon',
  /** 待核銷商品券到期日 */
  COMMODITY_COUPON_EXPIRED_DATE = 'commodityCouponExpiredDate',
  /** 已核銷商品券 */
  WRITE_OFF_COMMODITY_COUPON = 'writeOffCommodityCoupon',
  /** 核銷門市 */
  WRITE_OFF_STORE = 'writeOffStore',
  /** 核銷商品券日期 */
  WRITE_OFF_COMMODITY_COUPON_DATE = 'writeOffCommodityCouponDate',
  /** 逾期未核銷商品券 */
  NOT_WRITE_OFF_COMMODITY_COUPON = 'notWriteOffCommodityCoupon',
  /** 累點中集點卡 */
  REWARD_CARD = 'rewardCard',
  /** 累點中集點卡差異點數 */
  REWARD_CARD_DIFF_POINT = 'rewardCardDiffPoint',
  /** 已兌換集點卡 */
  RECEIVED_REWARD_CARD = 'receivedRewardCard',
  /** 已兌換集點卡點數 */
  RECEIVED_REWARD_CARD_POINT = 'receivedRewardCardPoint',
  /** 兌換集點卡日期 */
  REDEEMED_REWARD_CARD_DATE = 'redeemedRewardCardDate',
  /** 消費來源 */
  ORDER_CHANNEL = 'orderChannel',
  /** 消費品牌 */
  ORDER_BRAND = 'orderBrand',
  /** 消費門市 */
  ORDER_STORE = 'orderStore',
  /** 消費日期 */
  ORDER_DATE = 'orderDate',
  /** 消費人數 */
  ORDER_PEOPLE = 'orderPeople',
  /** 消費餐期 */
  ORDER_MEAL_DATE = 'orderMealDate',
  /** 消費商品 */
  ORDER_COMMODITY = 'orderCommodity',
  /** 累計消費次數 */
  ORDER_COUNT = 'orderCount',
  /** 累計原始訂單金額 */
  ORDER_ORIGINAL_AMOUNT = 'orderOriginalAmount',
  /** 累計實際消費金額 */
  ORDER_PAID_AMOUNT = 'orderPaidAmount',
  /** 累計折扣次數 */
  DISCOUNT_COUNT = 'discountCount',
  /** 累計折扣金額 */
  DISCOUNT_AMOUNT = 'discountAmount',
  /** 累計折抵點數次數 */
  DISCOUNT_POINT_COUNT = 'discountPointCount',
  /** 累計折抵點數 */
  DISCOUNT_POINT = 'discountPoint',
  /** 取消退貨日期 */
  CANCEL_RETURN_DATE = 'cancelReturnDate',
  /** 取消退貨次數 */
  CANCEL_RETURN_COUNT = 'cancelReturnCount',
  /** 取消退貨金額 */
  CANCEL_RETURN_AMOUNT = 'cancelReturnAmount',
  /** 宅配縣市區域 */
  DELIVERY = 'delivery',
  /** 支付方式 */
  PAYMENT = 'payment'
}
