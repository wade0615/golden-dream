/** 上架時間狀態 */
export enum COUPON_STATE_TYPE {
  ING = 'ING',
  END = 'END',
  NOT_START = 'NOT_START'
}

/** 兌換類型 */
export enum COUPON_EXCHANGE_TYPE {
  DISCOUNT = 1,
  COMMODITY = 2
}

export const COUPON_EXCHANGE_TYPE_CN = {
  [COUPON_EXCHANGE_TYPE.DISCOUNT]: '優惠券',
  [COUPON_EXCHANGE_TYPE.COMMODITY]: '商品券'
};

/** 發佈類型 */
export enum COUPON_RELEASE_STATUS_TYPE {
  UNPUBLISHED = '0',
  PUBLISHED = '1'
}

export const FRONT_COUPON_RELEASE_STATUS_TYPE = {
  [COUPON_RELEASE_STATUS_TYPE.PUBLISHED]: 1,
  [COUPON_RELEASE_STATUS_TYPE.UNPUBLISHED]: 2
};

export enum COUPON_RULE_TYPE {
  DATE = 1,
  DAY = 2
}

export enum COUPON_ISSUANCE_STATE_TYPE {
  END = 'END',
  NOT_START = 'NOT_START'
}

export enum COUPON_REWARD_RULES_TYPE {
  /** 紅利點數兌換 */
  POINT = '1',
  /** 手動發放 */
  BACKSTAGE = '2',
  /** 集點卡 */
  REWARD_CARD = '3',
  /** 註冊兌換 */
  REGISTER = '4',
  /** 續會禮 */
  RENEWAL = '5',
  /** 升等禮 */
  UPGRADE = '6',
  /** 生日兌換 */
  BIRTHDAY = '7'
}

export const COUPON_REWARD_RULES_TYPE_CN = {
  [COUPON_REWARD_RULES_TYPE.POINT]: '普通兌換',
  [COUPON_REWARD_RULES_TYPE.REWARD_CARD]: '集點卡兌換',
  [COUPON_REWARD_RULES_TYPE.BACKSTAGE]: '手動發放',
  [COUPON_REWARD_RULES_TYPE.REGISTER]: '註冊禮',
  [COUPON_REWARD_RULES_TYPE.RENEWAL]: '續會禮',
  [COUPON_REWARD_RULES_TYPE.UPGRADE]: '升等禮',
  [COUPON_REWARD_RULES_TYPE.BIRTHDAY]: '生日禮'
};

export enum MEMBER_SHIP_GIFT_STR {
  /** 續會禮 */
  RENEWAL = 'renewal',
  /** 升等禮 */
  UPGRADE = 'upgrade'
}

export const MEMBER_SHIP_GIFT_CN = {
  /** 續等 */
  [MEMBER_SHIP_GIFT_STR.RENEWAL]: '續等',
  /** 晉升 */
  [MEMBER_SHIP_GIFT_STR.UPGRADE]: '晉升'
};

export enum WRITE_OFF_METHODS {
  /** 核銷 */
  WRITE_OFF = 'WRITE_OFF',
  /** 取消核銷 */
  CANCEL_WRITE_OFF = 'CANCEL_WRITE_OFF'
}
