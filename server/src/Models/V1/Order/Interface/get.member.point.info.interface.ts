export interface GetMemberPointInfoResp {
  memberUsedPoint: MemberUsedPoint[];
  memberPoint: MemberPoint[];
}

export interface MemberUsedPoint {
  usedPoint: number;
  expiredDate: string;
}
export interface MemberPoint {
  point: number;
  expiredDate: string;
}
