import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMemberEcVoucherInfoDto {
  @ApiProperty({
    title: '流水號',
    example: 10,
    description: '流水號',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class TradeInfo {
  @ApiProperty({
    title: '交易時間',
    example: '2023/09/02 12:00'
  })
  tradeDate: string;

  @ApiProperty({
    title: '交易類型',
    example: '銷售'
  })
  tradeType: string;

  @ApiProperty({
    title: '交易序號',
    example: 'ST202305151120'
  })
  tradeNo: string;

  @ApiProperty({
    title: '交易方式',
    example: '信用卡'
  })
  payMethod: string;

  @ApiProperty({
    title: '訂單來源',
    example: '17Life電子票卷'
  })
  source: string;

  @ApiProperty({
    title: '發票號碼',
    example: 'EA4846526'
  })
  invoiceNo: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '續集'
  })
  brandName: string;

  @ApiProperty({
    title: '門市名稱',
    example: '續集'
  })
  storeName: string;

  @ApiProperty({
    title: '會員手機',
    example: '+88693585114'
  })
  mobile: string;

  @ApiProperty({
    title: '會員名稱',
    example: '王小明'
  })
  name: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'i230549748'
  })
  cardNo: string;

  @ApiProperty({
    title: '折扣內容',
    example: ''
  })
  discount: string;

  @ApiProperty({
    title: '折扣點數',
    example: 5
  })
  discountPoint: string;

  @ApiProperty({
    title: '原始金額',
    example: 7
  })
  originalAmount: string;

  @ApiProperty({
    title: '折扣金額',
    example: 7
  })
  discountAmount: string;

  @ApiProperty({
    title: '運費',
    example: 7
  })
  deliveryFee: string;

  @ApiProperty({
    title: '實付金額',
    example: 7
  })
  realAmount: string;
}

export class ProductInfo {
  @ApiProperty({
    title: '商品編號',
    example: 'D1544848'
  })
  productId: string;

  @ApiProperty({
    title: '商品名稱',
    example: '咖啡10杯'
  })
  productName: string;

  @ApiProperty({
    title: '可使用數量',
    example: '5'
  })
  canUseCount: string;

  @ApiProperty({
    title: '已核銷數量',
    example: '5'
  })
  writeOffCount: string;

  @ApiProperty({
    title: '已到期數量',
    example: '5'
  })
  expiredCount: string;

  @ApiProperty({
    title: '已轉贈數量',
    example: '5'
  })
  transferCount: string;

  @ApiProperty({
    title: '已退貨數量',
    example: '5'
  })
  returnCount: string;
}

export class GetMemberEcVoucherInfoResp {
  @ApiProperty({ type: [TradeInfo] })
  tradeInfo: TradeInfo;

  @ApiProperty({ type: ProductInfo })
  productInfo: ProductInfo[];
}
