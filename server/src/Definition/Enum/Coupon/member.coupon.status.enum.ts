export enum MEMBER_COUPON_STATUS {
  /** 未領取 */
  NOT_RECEIVED = 0,
  /** 已領取 */
  RECEIVED = 1,
  /** 已兌換 */
  REDEEMED = 2, // TODO 沒有使用到
  /** 已核銷 */
  VERIFIED = 3,
  /** 已轉贈 */
  TRANSFERRED = 4,
  /** 已退貨 */
  RETURNED = 5
}

export enum MEMBER_DETAIL_COUPON_STATUS {
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

export const MEMBER_DETAIL_COUPON_STATUS_CN = {
  [MEMBER_DETAIL_COUPON_STATUS.VALID]: '待核銷',
  [MEMBER_DETAIL_COUPON_STATUS.REDEEMED]: '已核銷',
  [MEMBER_DETAIL_COUPON_STATUS.EXPIRED]: '已到期',
  [MEMBER_DETAIL_COUPON_STATUS.TRANSFERRED]: '已轉贈',
  [MEMBER_DETAIL_COUPON_STATUS.RETURNED]: '已退貨'
};
