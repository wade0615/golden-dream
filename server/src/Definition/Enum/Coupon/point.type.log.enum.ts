/** 發放/扣點類型  */
export enum ENUM_POINT_TYPE_LOG {
  // 發放
  /** 基本消費回饋 */
  BASIC = 'basic',
  /** 生日當月消費回饋 */
  BIRTHDAY = 'birthday',
  /** 消費型積點回饋 */
  CONS = 'cons',
  /** 活動型積點回饋 */
  REWARD = 'reward',
  /** 積點調整-增點 */
  ADJUST_ADD = 'adjust_add',
  /** 優惠券兌換-退貨返點 */
  DISCOUNT_RETURN = 'discount_return',
  /** 商品券兑換-退貨返點	 */
  COMMODITY_RETURN = 'commodity_return',

  // 扣點
  /** 基本消費回饋-退貨 */
  BASIC_RETURN = 'basic_return',
  /** 生日當月消費回饋-退貨 */
  BIRTHDAY_RETURN = 'birthday_return',
  /** 消費型積點回饋-退貨 */
  CONS_RETURN = 'cons_return',
  /** 活動型積點回饋-扣點 */
  REWARD_RETURN = 'reward_minus',
  /** 積點調整-扣點 */
  ADJUST_MINUS = 'adjust_minus',
  /** 優惠券兌換 */
  DISCOUNT = 'discount',
  /** 商品券兑換 */
  COMMODITY = 'commodity',
  /** 已到期 */
  EXPIRED = 'expired'
}

export const ENUM_POINT_TYPE_LOG_STR = {
  // 發放
  [ENUM_POINT_TYPE_LOG.BASIC]: '基本消費回饋',
  [ENUM_POINT_TYPE_LOG.BIRTHDAY]: '生日當月消費回饋',
  [ENUM_POINT_TYPE_LOG.CONS]: '消費型積點回饋',
  [ENUM_POINT_TYPE_LOG.REWARD]: '活動型積點回饋',
  [ENUM_POINT_TYPE_LOG.ADJUST_ADD]: '積點調整-增點 ',
  [ENUM_POINT_TYPE_LOG.DISCOUNT_RETURN]: '優惠券兌換-退貨返點',
  [ENUM_POINT_TYPE_LOG.COMMODITY_RETURN]: '商品券兑換-退貨返點',

  // 扣點
  [ENUM_POINT_TYPE_LOG.BASIC_RETURN]: '基本消費回饋-退貨',
  [ENUM_POINT_TYPE_LOG.BIRTHDAY_RETURN]: '生日當月消費回饋-退貨',
  [ENUM_POINT_TYPE_LOG.CONS_RETURN]: '消費型積點回饋-退貨',
  [ENUM_POINT_TYPE_LOG.REWARD_RETURN]: '活動型積點回饋-扣點',
  [ENUM_POINT_TYPE_LOG.ADJUST_MINUS]: '積點調整-扣點 ',
  [ENUM_POINT_TYPE_LOG.DISCOUNT]: '優惠券兌換',
  [ENUM_POINT_TYPE_LOG.COMMODITY]: '商品券兑換',
  [ENUM_POINT_TYPE_LOG.EXPIRED]: '已到期'
};
