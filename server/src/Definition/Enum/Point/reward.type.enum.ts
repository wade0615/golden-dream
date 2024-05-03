/** 積點類型  */
export enum ENUM_REWARD_TYPE {
  /** 活動型 */
  REWARD = 'Reward',
  /** 消費型 */
  CONS = 'Cons'
}

export const ENUM_REWARD_TYPE_STR = {
  [ENUM_REWARD_TYPE.REWARD]: '活動型',
  [ENUM_REWARD_TYPE.CONS]: '消費型'
};
