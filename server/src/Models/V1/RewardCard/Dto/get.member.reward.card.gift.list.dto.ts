export class GetMemberRewardCardGiftListDto {
  rewardCardId: string;
  memberId: string;
}

export class RewardCardGift {
  id: string;
  brandId: string;
  couponName: string;
  mainImageUrl: string;
  thumbnailImageUrl: string;
  content: string;
  points: string;
  isExchange: boolean;
  exchangeContent: string;
  startDate: string;
  endDate: string;
  redemptionStartDate: string;
  redemptionEndDate: string;
  earliestPickupDate: number;
  pickUpStartDate: string;
  pickUpEndDate: string;
}

export class RewardCardGiftList {
  sectionTitle: string;
  rewardCardGift: RewardCardGift[];
}

export class GetMemberRewardCardGiftListResp {
  memberPoints: number;
  rewardCardGiftList: RewardCardGiftList[];
  next: number;
}
