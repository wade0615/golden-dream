/** 調整類型  */
export enum ENUM_ADJUST_POINT_TYPE {
  /** 增點 */
  ADD = 1,
  /** 扣點 */
  MINUS = 2
}

export const ENUM_ADJUST_POINT_TYPE_STR = {
  [ENUM_ADJUST_POINT_TYPE.ADD]: '增點',
  [ENUM_ADJUST_POINT_TYPE.MINUS]: '扣點'
};
