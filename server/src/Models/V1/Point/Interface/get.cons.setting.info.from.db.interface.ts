import { Brands } from './get.cons.setting.info.interface';

export interface GetConsSettingInfoResp {
  consSettingInfo: ConsSettingInfo[];
  consSettingBrand: ConsSettingBrand[];
  consSettingProduct: ConsSettingProduct[];
  brands: Brands[];
}

export interface ConsSettingInfo {
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
}

export interface RewardPoints {
  ratioType: string;
  ratioStatus: number;
  purchasedSum: number;
  purchasedEvery: number;
  handselPoint: number;
}

export interface ConsSettingBrand {
  brandId: string;
  brandName: string;
  storeId: string;
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
