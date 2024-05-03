export class ExchangeCouponDto {
  memberId: string;
  channelId: string;
  couponType: number;
  couponId: string;
  storeId: string;
}

export class ExchangeCouponResp {
  couponId: string;
  couponSeq: number;
  brandIds: string[];
  transactionId: string;
  transactionDate: string;
  point: number;
  couponName: string;
}
