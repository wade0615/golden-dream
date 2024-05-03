export interface GetMemberShipLogInfoResp {
  logCount: LogCount[];
  logList: LogList[];
}

export interface LogCount {
  count: number;
}

export interface LogList {
  memberShipId: string;
  actionType: number;
  startDate: string;
  endDate: string;
  createTime: string;
}
