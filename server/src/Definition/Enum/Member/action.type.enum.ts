export enum ENUM_ACTION_TYPE {
  /** 註冊 */
  REGISTER = 1,
  /** 升等 */
  UPGRADE = 2,
  /** 續會 */
  RENEWAL = 3,
  /** 降等or續會降等 */
  DAWNGRADE = 4
}

export const ENUM_ACTION_TYPE_STR = {
  // 發放
  [ENUM_ACTION_TYPE.REGISTER]: '註冊',
  [ENUM_ACTION_TYPE.UPGRADE]: '升等',
  [ENUM_ACTION_TYPE.RENEWAL]: '續會',
  [ENUM_ACTION_TYPE.DAWNGRADE]: '降等'
};
