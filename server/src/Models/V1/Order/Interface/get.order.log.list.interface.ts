export interface GetOrderLogListResp {
  memberId: string;
  transactionId: string;
  channelId: string;
  channelName: string;
  brandId: string;
  brandName: string;
  storeName: string;
  transactionType: string;
  paidAmount: number;
  memberCardId: string;
  memberName: string;
  mobileCountryCode: string;
  mobile: string;
  transactionTime: string;
  invoiceNumber: string;
  pointDeduction: number;
  originalAmount: number;
  discountAmount: number;
  shippingFee: number;
}
