export interface GetMemberEcVoucherLogInfoResp {
  logCount: LogCount[];
  logList: LogList[];
}

export interface LogCount {
  count: number;
}

export interface LogList {
  id: number;
  cardId: string;
  name: string;
  brandName: string;
  voucherName: string;
  amount: string;
  tradeDate: string;
  expireDate: string;
  tradeNo: string;
  canUseCount: string;
  writeOffCount: string;
  expiredCount: string;
  transferCount: string;
  returnCount: string;
}
