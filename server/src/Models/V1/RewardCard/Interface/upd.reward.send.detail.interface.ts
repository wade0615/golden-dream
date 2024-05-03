export interface RewardSendMemberDetail {
  memberId: string;
  rewardPoint: number;
}

export interface UpdRewardSendDetailReq {
  memberId: string;
  rewardCardId: string;
  risId: string;
  couponId: string;
  transactionId: string;
  transactionType: number;
  transactionDate: string;
  rewardPoint: number;
  lastPoint: number;
}
