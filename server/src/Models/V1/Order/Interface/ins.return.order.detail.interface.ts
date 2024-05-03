export interface InsReturnOrderDetailReq {
  channelId: string;
  transactionId: string;
  transactionType: number;
  transactionTime: string;
  memberCardId: string;
  invoiceNumber: string;
  mobileCountryCode: string;
  mobile: string;
  brandId: string;
  storeId: string;
  paidAmount: number;
  deliveryCity: string;
  deliveryDistrict: string;
  deliveryAddress: string;
  remark: string;
}
