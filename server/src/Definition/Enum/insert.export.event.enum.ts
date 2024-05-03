export enum ENUM_INSERT_EXPORT_EVENT {
  /** 會員資料 */
  MEMBER_INFO = 'memberInfo',
  /** 消費紀錄 */
  ORDER_DETAIL = 'orderDetail',
  /** 電子票券紀錄 */
  /** 積點明細 */
  POINT_LOG = 'pointLog',
  /** 優惠券明細 */
  COUPON_DETAIL = 'couponDetail',
  /** 商品券明細 */
  COMMONDITY_DETAIL = 'commodityDetail',
  /** 集點卡明細 */
  REWARD_DETAIL = 'rewardDetail',
  /** 會員標籤管理 */
  MEMBER_TAG = 'memberTag',
  /** MOT 發送紀錄  */
  MOT_SEND_LOG = 'motSendLog',
  /** 會員消費分析 */
  MEMBER_CONSUMPTION_ANALYSIS = 'memberConsumptionAnalysis',
  /** 集團營業額 */
  CORPORATION_AMOUNT = 'corporationAmount',
  /** 營業額組成 */
  AMOUNT_COMPOSITION = 'amountComposition',
  /** 點數統計 */
  POINT_STATISTICS = 'pointStatistics',
  /** 優惠券分析 */
  COUPON_ANALYSIS = 'couponAnalysis',
  /** 會員輪廓分析 */
  MEMBER_INFO_ANALYSIS = 'memberInfoAnalysis',
  /** 電子票券 */
  EC_Voucher = 'ECVoucher'
}

export const ENUM_INSERT_EXPORT_EVENT_STR = {
  [ENUM_INSERT_EXPORT_EVENT.MEMBER_INFO]: '會員資料',
  [ENUM_INSERT_EXPORT_EVENT.ORDER_DETAIL]: '消費紀錄',
  [ENUM_INSERT_EXPORT_EVENT.EC_Voucher]: '電子票券紀錄',
  [ENUM_INSERT_EXPORT_EVENT.POINT_LOG]: '積點明細',
  [ENUM_INSERT_EXPORT_EVENT.COUPON_DETAIL]: '優惠券明細',
  [ENUM_INSERT_EXPORT_EVENT.COMMONDITY_DETAIL]: '商品券明細',
  [ENUM_INSERT_EXPORT_EVENT.REWARD_DETAIL]: '集點卡明細',
  [ENUM_INSERT_EXPORT_EVENT.MEMBER_TAG]: '會員標籤管理'
};
