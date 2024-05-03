export class GetMemberCouponDetailDto {
  memberId: string;
  couponSeq: string;
}

export class MemberCouponDetail {
  couponSeq: string;
  redeemId: string;
  couponId: string;
  rewardCardId: string;
  couponName: string;
  brandIds: string[];
  mainImageUrl: string;
  thumbnailImageUrl: string;
  startDate: string;
  endDate: string;
  redemptionStartDate: string;
  redemptionEndDate: string;
  couponStatus: number;
  content: string;
  transferorCountryCode: string;
  transferorMobile: string;
  donorCountryCode: string;
  donorMobile: string;
  expiredDate: string;
  transferMemberId: string;
  donorMemberId: string;
  alterDate: string;
  isTransferable: boolean;
  transactionDate: string;
}

export class GetMemberCouponDetailResp {
  couponDetail: MemberCouponDetail;
}
