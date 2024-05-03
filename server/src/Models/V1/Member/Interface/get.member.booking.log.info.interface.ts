export interface GetMemberBookingLogInfoResp {
  logCount: LogCount[];
  logList: LogList[];
}

export interface LogCount {
  count: number;
}

export interface LogList {
  brandName: string;
  storeName: string;
  peopleCount: number;
  mealDate: string;
  mealTime: string;
  isCheckIn: boolean;
  bookingId: string;
}
