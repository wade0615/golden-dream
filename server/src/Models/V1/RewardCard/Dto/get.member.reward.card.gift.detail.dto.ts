export class GetMemberRewardCardGiftDetailDto {
  id: string;
  memberId: string;
}

export class RewardCardGiftDetail {
  rewardCardId: string;
  couponId: string;
  couponName: string;
  couponType: number;
  brandId: string;
  mainImageUrl: string;
  thumbnailImageUrl: string;
  content: string;
  points: string;
  isExchange: boolean;
  exchangeContent: string;
  expirationRule: number;
  startDate: string;
  endDate: string;
  redemptionStartDate: string;
  redemptionEndDate: string;
  earliestPickupDate: number;
  pickUpStartDate: string;
  pickUpEndDate: string;
}

export class GetMemberRewardCardGiftDetailResp {
  rewardCardGiftDetail: RewardCardGiftDetail;
}
