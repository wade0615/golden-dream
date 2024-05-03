export enum COMMODITY_STATUS_STR {
  /** 銷售 */
  SALE = 'SALE',
  /** 停售 */
  STOP_SELL = 'STOP_SELL'
}

export const COMMODITY_STATUS = {
  [COMMODITY_STATUS_STR.SALE]: '1',
  [COMMODITY_STATUS_STR.STOP_SELL]: '2'
};

export enum COMMODITY_METHODS {
  ADD = '1',
  UPD = '2'
}
