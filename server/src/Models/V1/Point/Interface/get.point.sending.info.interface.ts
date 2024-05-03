export interface GetPointSendingInfoResp {
  rewardCount: RewardCount[];
  rewardList: RewardList[];
}

export interface RewardCount {
  rewardCount: number;
}

export interface RewardList {
  rewardId: string;
  rewardName: string;
  memberShipName: string[];
  rewardType: string;
  rewardPoints: RewardPoints[];
  startDate: string;
  endDate: string;
  createDate: string;
  createId: string;
  modifyDate: string;
  modifyId: string;
}

export interface RewardPoints {
  ratioType: string;
  purchasedSum: number;
  purchasedEvery: number;
  handselPoint: number;
}
