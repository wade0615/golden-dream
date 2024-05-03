import { PartialType } from '@nestjs/swagger';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class ExchangeRewardCardDto extends PartialType(IamObjectDto) {
  id: string;
  memberId: string;
  storeId: string;
}

export class ExchangeRewardCardResp {
  id: string;
  couponId: string;
  couponName: string;
  brandId: string;
  transactionId: string;
  transactionType: number;
  transactionDate: string;
  point: string;
}
