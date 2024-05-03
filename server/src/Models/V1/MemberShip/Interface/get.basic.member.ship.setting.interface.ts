export interface GetBasicMemberShipSettingResp {
  settingId: string;
  memberShipId: string;
  memberShipName: string;
  memberShipCount: number;
  memberShipYear: number;
  endDate: number;
}

export interface Result {
  settingId: string;
  memberShipId: string;
  memberShipCount: number;
  memberShipYear: number;
  endDate: number;
}
