export interface GetProductInfoResp {
  productListCount: ProductCount[];
  productList: ProductList[];
}

export interface ProductCount {
  productCount: number;
}

export interface ProductList {
  productId: string;
  productName: string;
  brandName: string;
  channelName: string;
}
