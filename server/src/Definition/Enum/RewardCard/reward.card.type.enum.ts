export enum REWARD_CARD_TYPE {
  /** 初始狀態 */
  INIT = 0,
  /** 兌換券兌換 */
  COUPON = 1,
  /** 消費回饋 */
  ORDER = 2,
  /** 退貨返點 */
  ORDER_RETURN = 3,
  /** 集點調整 */
  REWARD_ISSUANCE = 4,
  /** 集點過期 */
  REWARD_EXPIRED = 5,
  /** 點數轉移 */
  REWARD_SHIFT = 6
}

export const REWARD_CARD_TYPE_STR = {
  [REWARD_CARD_TYPE.COUPON]: '滿點自動兌換',
  [REWARD_CARD_TYPE.ORDER]: '消費回饋',
  [REWARD_CARD_TYPE.ORDER_RETURN]: '退貨返點',
  [REWARD_CARD_TYPE.REWARD_ISSUANCE]: '集點調整',
  [REWARD_CARD_TYPE.REWARD_EXPIRED]: '集點過期',
  [REWARD_CARD_TYPE.REWARD_SHIFT]: '點數轉移'
};

/** 上架時間狀態 */
export enum REWARD_CARD_STATE_TYPE {
  ING = 'ING',
  END = 'END',
  NOT_START = 'NOT_START'
}

/** 發佈類型 */
export enum REWARD_CARD_RELEASE_STATUS_TYPE {
  UNPUBLISHED = '0',
  PUBLISHED = '1'
}

export const FRONT_REWARD_CARD_RELEASE_STATUS_TYPE = {
  [REWARD_CARD_RELEASE_STATUS_TYPE.PUBLISHED]: 1,
  [REWARD_CARD_RELEASE_STATUS_TYPE.UNPUBLISHED]: 2
};

/** 集點卡效期規則 */
export enum REWARD_CARD_EXPIRATION_RULE_TYPE {
  /** 依上下架時間 */
  START_AND_END_DATE = 1,
  /** 會員首次消費日起算1年 */
  CONSUME_DATE_ONE_YEAR = 2
}

export enum REWARD_CARD_SEND_MEMBER_TYPE {
  /** 批量匯入 */
  IMPORT = 'IMPORT',
  /** 指定會員 */
  ASSIGN = 'ASSIGN'
}
