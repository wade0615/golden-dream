export enum ENUM_EC_VOUCHER_STATE {
  /** 可使用 */
  CAN_USE = 'canUse',
  /** 已核銷 */
  WRITE_OFF = 'writeOff',
  /** 已到期 */
  EXPIRED = 'expired',
  /** 已轉贈 */
  TRANSFER = 'transfer',
  /** 已退貨 */
  RETURN = 'return'
}

export const ENUM_EC_VOUCHER_STATE_STR = {
  // 發放
  [ENUM_EC_VOUCHER_STATE.CAN_USE]: '可使用',
  [ENUM_EC_VOUCHER_STATE.WRITE_OFF]: '已核銷',
  [ENUM_EC_VOUCHER_STATE.EXPIRED]: '已到期',
  [ENUM_EC_VOUCHER_STATE.TRANSFER]: '已轉贈',
  [ENUM_EC_VOUCHER_STATE.RETURN]: '已退貨'
};
