export interface GetStoreFilterOptionsFromDBResp {
  mallInfo: Mall[];
  brandInfo: Brand[];
}

export interface Mall {
  mallName: string;
}

export interface Brand {
  brandId: string;
  brandName: string;
}
