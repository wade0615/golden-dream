import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOrderDetailByTransactionIdDto {
  @ApiProperty({
    description: '交易編號'
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class GetOrderDetailByTransactionIdResp {
  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '9123456789',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '會員姓名',
    example: '0',
    description: '會員名稱'
  })
  memberName: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'i123456789',
    description: '會員卡號'
  })
  memberCardId: string;

  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號'
  })
  brandId: string;

  @ApiProperty({
    title: '門市 ID',
    default: 'S2212290072',
    description: '門市編號'
  })
  storeId: string;

  @ApiProperty({
    title: '用餐方式',
    default: 'DINE_IN',
    description: '用餐方式，DINE_IN：內用; TAKE_OUT：外帶'
  })
  mealType: string;

  @ApiProperty({
    title: '付款方式',
    default: '1',
    description: '依支付方式設定'
  })
  paymentSeq: number;

  @ApiProperty({
    title: '交易日期',
    default: '1',
    description: '交易日期'
  })
  transactionDate: string;

  @ApiProperty({
    title: '訂單金額',
    default: '1000',
    description: '訂單金額'
  })
  amount: number;

  @ApiProperty({
    title: '發票',
    default: 'TXGHXD1012',
    description: '發票，限10碼英數字'
  })
  invoiceNumber: string;
}
