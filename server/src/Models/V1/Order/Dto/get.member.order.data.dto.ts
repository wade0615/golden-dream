export class GetMemberOrderDataDto {
  memberId: string;
  channelId: string;
  startDate: string;
  endDate: string;
  page: number;
  perPage: number;
}

export class MemberOrderData {
  transactionId: string;
  transactionType: number;
  transactionDate: string;
  brandId: string;
  cost: number;
  storeName: string;
}

export class GetMemberOrderDataResp {
  next: number;
  memberOrderData: MemberOrderData[];
}
