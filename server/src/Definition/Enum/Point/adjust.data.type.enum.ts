/** 會員  */
export enum ENUM_ADJUST_DATA_TYPE {
  /** 依每日排程 */
  DAY = 1,
  /** 指定發放日 */
  ASSIGN = 2
}

export const ENUM_ADJUST_DATA_TYPE_STR = {
  [ENUM_ADJUST_DATA_TYPE.DAY]: '依每日排程',
  [ENUM_ADJUST_DATA_TYPE.ASSIGN]: '指定發放日'
};
