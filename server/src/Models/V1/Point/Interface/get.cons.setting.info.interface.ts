export interface GetConsSettingInfoResp {
  rewardId: string;
  rewardName: string;
  startDate: string;
  endDate: string;
  activeStatus: string;
  activeDay: string;
  selectStore: number;
  exceptionDate: string[];
  channelId: string[];
  memberShip: string[];
  mealPriodId: string[];
  rewardPoints: RewardPoints[];
  brands: Brands[];
  brandAndStore: ConsSettingBrand[];
  product: ConsSettingProduct[];
}

export interface Brands {
  brandId: string;
  brandName: string;
  isCorporation: boolean;
}

export interface RewardPoints {
  ratioType: string;
  ratioStatus: boolean;
  purchasedSum: number;
  purchasedEvery: number;
  handselPoint: number;
}

export interface ConsSettingBrand {
  brandId: string;
  brandName: string;
  storeName: string;
  cityCode: string;
  zipCode: string;
  mallName: string;
  posStore: string;
}

export interface ConsSettingProduct {
  productId: string;
  productName: string;
  brandName: string;
}
