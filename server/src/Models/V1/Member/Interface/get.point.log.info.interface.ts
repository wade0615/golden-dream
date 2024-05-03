export interface GetPointLogInfoResp {
  logCount: LogCount[];
  logList: LogList[];
}

export interface LogCount {
  count: number;
}

export interface LogList {
  pointItem: string;
  point: string;
  expiredDate: string;
  sendDate: string;
  deductDate: string;
  brandName: string;
  storeName: string;
  orderId: string;
}
