export class OrderData {
  brandId: string;
  memberId: string;
  tradeDate: string;
  orderFinishDate: string;
  crmCreateDate: string;
  canCalcDate: string;
  realCalcDate: string;
  amount: number;
  source: string;
  transactionId: string;
}

export class AddDemoDataDto {
  orderData: OrderData[];
  returnOrder: OrderData[];
}
