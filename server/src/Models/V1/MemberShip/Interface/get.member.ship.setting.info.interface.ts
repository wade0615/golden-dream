export interface GetMemberShipSettingInfoResp {
  settingId: string;
  settingName: string;
  startDate: string;
  startDateCount: number;
  startDateYear: number;
  endDate: number;
  consumptionUpgrade: number;
  consumptionDue: number;
  upgradeDay: number;
  upgradeNum: number;
  isCopy: boolean;
  registerGift: RegisterGift[];
  memberShip: MemberShip[];
}

export interface MemberShipCouponDetail {
  couponId: string;
  couponName: string;
}

export interface RegisterGift {
  channelId: string;
  channelName: string;
  couponDetail: MemberShipCouponDetail[];
}

export interface MemberShip {
  memberShipId: string;
  memberShipName: string;
  nextMemberShip: string;
  purchasedCount: number;
  purchasedTimes: number;
  expiresChange: number;
  renewalGift: MemberShipCouponDetail[];
  upgradeGift: MemberShipCouponDetail[];
  basicSetting: BasicSetting;
  birthdaySetting: BirthdaySetting;
}

export interface BasicSetting {
  activeStatus: number;
  activeDay: number;
  setting: Setting[];
}

export interface Setting {
  pointType: string;
  pointRatioType: string;
  status: boolean;
  purchasedSum: number;
  purchasedEvery: number;
  purchasedPoint: number;
}

export interface BirthdaySetting {
  activeStatus: number;
  activeDay: number;
  setting: Setting[];
}

export interface GetMemberShipSettingInfoFromDBResp {
  settingId: string;
  settingName: string;
  startDate: string;
  startDateCount: number;
  startDateYear: number;
  endDate: number;
  consumptionUpgrade: number;
  consumptionDue: number;
  upgradeDay: number;
  upgradeNum: number;
  memberShipId: string;
  memberShipName: string;
  nextShipId: string;
  purchasedCount: number;
  purchasedTimes: number;
  expiresChange: number;
  pointType: string;
  pointRatioType: string;
  status: boolean;
  purchasedSum: number;
  purchasedEvery: number;
  purchasedPoint: number;
  activeStatus: number;
  activeDay: number;
  isCopy: number;
}
