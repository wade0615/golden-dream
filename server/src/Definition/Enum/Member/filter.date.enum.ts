export enum ENUM_FILTER_DATE {
  /** 近三個月 */
  THREE_MONTH = '90',
  /** 近六個月 */
  SIX_MONTH = '180',
  /** 近一年 */
  YEAR = '365',
  /** 自訂區間 */
  CUST = 'cust'
}

export const ENUM_FILTER_DATE_STR = {
  // 發放
  [ENUM_FILTER_DATE.THREE_MONTH]: '近3個月',
  [ENUM_FILTER_DATE.SIX_MONTH]: '近6個月',
  [ENUM_FILTER_DATE.YEAR]: '近一年',
  [ENUM_FILTER_DATE.CUST]: '自訂區間'
};
