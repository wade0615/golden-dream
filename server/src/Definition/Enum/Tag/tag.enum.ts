export enum TAG_DATE_STATE_TYPE {
  /** 時間區間 */
  RANGE = 1,
  /** 永久 */
  PERMANENT = 2
}

export const TAG_DATE_STATE_TYPE_CODE = {
  [TAG_DATE_STATE_TYPE.RANGE]: 'RANGE',
  [TAG_DATE_STATE_TYPE.PERMANENT]: 'PERMANENT'
};

export enum TAG_STATE_TYPE {
  /** 啟用 */
  ENABLE = 1,
  /** 停用 */
  DISABLE = 2
}

export const TAG_STATE_TYPE_CODE = {
  [TAG_STATE_TYPE.DISABLE]: 'DISABLE',
  [TAG_STATE_TYPE.ENABLE]: 'ENABLE'
};
