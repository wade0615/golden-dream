export class GetMemberCouponListDto {
  memberId: string;
  page: number;
  perPage: number;
}

export class MemberCouponList {
  couponId: string;
  couponSeq: string;
  couponName: string;
  brandIds: string[];
  mainImageUrl: string;
  thumbnailImageUrl: string;
  startDate: string;
  endDate: string;
  redemptionStartDate: string;
  redemptionEndDate: string;
  content: string;
  transferorCountryCode: string;
  transferorMobile: string;
  couponStatus: number;
  transactionDate: string;
  couponEndDate: string;
}

export class GetMemberCouponListResp {
  couponList: MemberCouponList[];
  next: number;
}
