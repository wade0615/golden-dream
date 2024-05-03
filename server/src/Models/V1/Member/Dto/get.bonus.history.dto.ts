export class GetBonusHistoryDto {
  memberId: string;
  channelId: string;
  startDate: string;
  endDate: string;
  page: number;
  perPage: number;
}

export class BonusHistory {
  id: string;
  orderId: string;
  couponId: string;
  couponName: string;
  brandId: string;
  transactionId: string;
  transactionType: number;
  transactionDate: string;
  point: number;
  storeName: string;
  cost: number;
}

export class GetBonusHistoryResp {
  next: number;
  bonusHistory: BonusHistory[];
}
