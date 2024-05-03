export class GetPosMemberCouponDetailDto {
  redeemId: string;
}

export class GetPosMemberCouponDetailResp {
  transactionType: number;
  couponName: string;
  couponType: number;
  rewardRule: number;
  couponEndDate: string;
  storeIds: string[];
  memberName: string;
  memberCardId: string;
}
