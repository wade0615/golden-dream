export interface InsTempOrderLogReq {
  transactionId: string | number;
  transactionDate: string;
  transactionMethod: string;
  memberCardId: string;
  orderChannelId: string;
  brandId: string;
  mobileCountryCode: string;
  mobile: string;
}
