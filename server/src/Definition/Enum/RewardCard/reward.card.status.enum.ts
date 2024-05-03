export enum REWARD_CARD_DETAIL_STATUS {
  /** 未知 */
  UNKNOWN = '0',
  /** 可使用/待核銷 */
  VALID = '1',
  /** 已核銷 */
  REDEEMED = '2',
  /** 已到期 */
  EXPIRED = '3',
  /** 已轉贈 */
  TRANSFERRED = '4',
  /** 已退貨 */
  RETURNED = '5'
}

export const REWARD_CARD_STATUS_CN = {
  [REWARD_CARD_DETAIL_STATUS.VALID]: '待核銷',
  [REWARD_CARD_DETAIL_STATUS.REDEEMED]: '已核銷',
  [REWARD_CARD_DETAIL_STATUS.EXPIRED]: '已到期',
  [REWARD_CARD_DETAIL_STATUS.TRANSFERRED]: '已轉贈',
  [REWARD_CARD_DETAIL_STATUS.RETURNED]: '已退貨'
};

export enum REWARD_CARD_STATE {
  /** 集點中 */
  ING = 1,
  /** 已集滿 */
  FULL = 2,
  /** 已到期 */
  EXPIRATION = 3
}

export enum REWARD_CARD_STATE_STR {
  /** 集點中 */
  ING = '集點中',
  /** 已集滿 */
  FULL = '已集滿',
  /** 已到期 */
  EXPIRATION = '已到期'
}
