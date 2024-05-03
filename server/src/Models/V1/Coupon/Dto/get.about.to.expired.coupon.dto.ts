export class GetAboutToExpiredCouponDto {
  memberId: string;
}

export class GetAboutToExpiredCouponResp {
  isCouponExpired: boolean;
  count: number;
}
