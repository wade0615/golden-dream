export class GetMotSettingListResp {
  settingList: SettingList[];
}

export class SettingList {
  event: string;
  eventName: string;
  state: boolean;
  appPush: boolean;
  sms: boolean;
  email: boolean;
  createDate: string;
  createId: string;
  alterDate: string;
  alterId: string;
  canUpdateApp: boolean;
  canUpdateSms: boolean;
  canUpdateEmail: boolean;
  mainIsSave: boolean;
}
