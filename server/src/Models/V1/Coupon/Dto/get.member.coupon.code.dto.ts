export class GetMemberCouponCodeDto {
  memberId: string;
  couponSeq: string;
}

export class GetMemberCouponCodeResp {
  redeemId: string;
  couponId: string;
  couponSeq: string;
  brandIds: string[];
  couponName: string;
  mainImageUrl: string;
  thumbnailImageUrl: string;
  startDate: string;
  endDate: string;
  content: string;
  couponStartDate: string;
  couponEndDate: string;
  expiredDate: string;
}
