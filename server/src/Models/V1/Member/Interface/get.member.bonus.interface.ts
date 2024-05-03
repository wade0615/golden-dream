export interface GetMemberBonusFromDBResp {
  memberPoint: MemberPoint[];
  memberShip: MemberShip;
  pointSetting: PointSetting;
}

export interface MemberPoint {
  point: number;
  expiredDate: string;
}

export interface MemberShip {
  memberId: string;
  id: number;
  memberShip: string;
  endDate: string;
  totalAmount: number;
}

export interface GetMemberBonusResp {
  currentLevelName: string;
  nextLevelName: string;
  levelEndDate: string;
  totalPoints: string;
  levelNowPoints: string;
  levelNeedPoints: string;
  levelUpPoints: string;
  thisYearBonusEndDate: string;
  nextYearBonusEndDate: string;
  thisYearPoints: string;
  nextYearPoints: string;
}

export interface PointSetting {
  expiryDay: number;
  expiryMonth: number;
  expiryDate: number;
}
