export enum TRANSACTION_TYPE_STR {
  /** 銷售 */
  SALE = 'SALE',
  /** 退貨 */
  RETURN = 'RETURN'
}

export const TRANSACTION_TYPE = {
  [TRANSACTION_TYPE_STR.SALE]: '1',
  [TRANSACTION_TYPE_STR.RETURN]: '2'
};

export const TRANSACTION_TYPE_CODE = {
  '1': TRANSACTION_TYPE_STR.SALE,
  '2': TRANSACTION_TYPE_STR.RETURN
};

export const EXCEL_TRANSACTION_NAME_TYPE = {
  '1': '銷售',
  '2': '退貨'
};

/** 用餐類型 */
export enum ORDER_MEAL_TYPE_STR {
  /** 內用 */
  DINE_IN = 'DINE_IN',
  /** 外帶 */
  TAKE_OUT = 'TAKE_OUT'
}

export const ORDER_MEAL_TYPE = {
  1: ORDER_MEAL_TYPE_STR.DINE_IN,
  2: ORDER_MEAL_TYPE_STR.TAKE_OUT
};
