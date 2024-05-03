export interface GetEcVoucherInfoResp {
  name: string;
  cardNo: string;
  mobile: string;
  tradeDate: string;
  tradeNo: string;
  source: string;
  brandName: string;
  storeName: string;
  tradeType: string;
  payMethod: string;
  invoiceNo: string;
  discount: string;
  discountPoint: number;
  originalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  realAmount: number;
  productId: string;
  productName: string;
  canUseCount: number;
  writeOffCount: number;
  expiredCount: number;
  transferCount: number;
  returnCount: number;
}
