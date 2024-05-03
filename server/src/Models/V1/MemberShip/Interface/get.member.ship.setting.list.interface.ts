export interface GetMemberShipSettingListFromDBResp {
  settingId: string;
  settingName: string;
  effectiveStarDate: string;
  settingStatus: number;
  createDate: string;
  createName: string;
  alterDate: string;
  alterName: string;
}

export interface GetMemberShipSettingListResp {
  settingList: SettingList[];
}

export interface SettingList {
  settingId: string;
  settingName: string;
  effectiveStarDate: string;
  settingStatus: number;
  createDate: string;
  createName: string;
  alterDate: string;
  alterName: string;
  realStartDate: string;
  settingStatusStr: string;
}
