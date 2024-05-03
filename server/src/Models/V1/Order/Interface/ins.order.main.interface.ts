export interface InsOrderMainReq {
  orderId: string;
  channelId: string;
  transactionId: string;
  transactionType: number;
  transactionTime: string;
  memberId: string;
  memberCardId: string;
  invoiceNumber: string;
  mobileCountryCode: string;
  mobile: string;
  brandId: string;
  storeId: string;
}
