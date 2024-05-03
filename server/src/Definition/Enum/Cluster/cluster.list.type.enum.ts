export enum CLUSTER_LIST_TYPE {
  /** 單次 */
  SINGLE = 'single',
  /** 定期 */
  REGULAR = 'regular'
}

export enum CLUSTER_EVENT_STATUS {
  /** 待執行 */
  PENDING = 'pending',
  /** 已結束 */
  END = 'end'
}

export enum CLUSTER_STATE_TYPE {
  /** 待執行 */
  PENDING = 'PENDING',
  /** 已結束 */
  END = 'END',
  /** 執行中 */
  ING = 'ING',
}