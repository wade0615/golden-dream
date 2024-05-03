export class GetMemberRewardCardListDto {
  brandIds: string[];
  channelPwd: string;
  page: number;
  perPage: number;
}

export class MemberRewardCardList {
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

export class GetMemberRewardCardListResp {
  next: number;
  list: MemberRewardCardList[];
}
