export interface GetPointLogInfoResp {
  logCount: LogCount[];
  logList: LogList[];
}

export interface LogCount {
  count: number;
}

export interface LogList {
  pointItem: string;
  point: number;
  cardId: string;
  name: string;
  orderType: string;
  orderId: string;
  expiredDate: string;
  sendDate: string;
  deductDate: string;
  brandName: string;
  storeName: string;
  mobileCountryCode: string;
  mobile: string;
}
