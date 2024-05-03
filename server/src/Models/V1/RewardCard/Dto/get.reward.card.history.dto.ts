export class GetRewardCardHistoryDto {
  rewardCardId: string;
  memberId: string;
  startDate: string;
  endDate: string;
  page: number;
  perPage: number;
}

export class RewardCardHistoryInfo {
  id: string;
  couponId: string;
  brandId: string;
  storeId: string;
  transactionId: string;
  transactionType: number;
  transactionTypeName: string;
  transactionDate: string;
  transactionAmount: string;
  point: string;
}

export class RewardCardHistory {
  month: string;
  rewardCardHistoryInfo: RewardCardHistoryInfo[];
}

export class GetRewardCardHistoryResp {
  rewardCardHistory: RewardCardHistory[];
  next: number;
}
