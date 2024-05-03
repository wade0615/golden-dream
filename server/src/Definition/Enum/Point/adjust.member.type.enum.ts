/** 會員  */
export enum ENUM_ADJUST_MEMBER_TYPE {
  /** 批量匯入 */
  BATCH = 1,
  /** 指定會員 */
  ASSIGN = 2
}

export const ENUM_ADJUST_MEMBER_TYPE_STR = {
  [ENUM_ADJUST_MEMBER_TYPE.BATCH]: '批量匯入',
  [ENUM_ADJUST_MEMBER_TYPE.ASSIGN]: '指定會員'
};
