export class GetMemberRewardCardDetailDto {
  rewardCardId: string;
  memberId: string;
}

export class MemberRewardCardDetail {
  rewardCardId: string;
  rewardCardName: string;
  brandId: string;
  mainImageUrl: string;
  thumbnailImageUrl: string;
  content: string;
  startDate: string;
  endDate: string;
  redemptionStartDate: string;
  redemptionEndDate: string;
  maxPoint: number;
}

export class GetMemberRewardCardDetailResp {
  memberPoints: number;
  rewardCardDetail: MemberRewardCardDetail;
  giftPoints: number[];
}
