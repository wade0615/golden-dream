export interface GetStoreInfoResp {
  storeListCount: StoreCount[];
  storeList: StoreList[];
}

export interface StoreCount {
  storeCount: number;
}

export interface StoreList {
  brandName: string;
  storeName: string;
  city: string;
  zip: string;
  mallName: string;
  posStore: string;
}
