import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class GetOrderDetailDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '交易序號 ID',
    example: 'C230811006',
    description: '兌換券交易序號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class OrderProductList {
  @ApiProperty({
    title: '商品編號',
    example: '1',
    description: '依訂單商品MAP表編號欄位設定'
  })
  productId: string;

  @ApiProperty({
    title: '商品名稱',
    example: '商品名稱001',
    description: '依訂單商品MAP表名稱欄位設定'
  })
  productName: string;

  @ApiProperty({
    title: '商品數量',
    example: '1',
    description: '依訂單商品MAP表數量欄位設定'
  })
  productCount: number;
}

export class OrderDeliveryInfo {
  @ApiProperty({
    title: '宅配城市',
    example: '',
    description: '宅配城市'
  })
  deliveryCity: string;

  @ApiProperty({
    title: '宅配地區',
    example: '',
    description: '宅配地區'
  })
  deliveryZip: string;

  @ApiProperty({
    title: '宅配地址',
    example: '',
    description: '宅配地址'
  })
  deliveryAddress: string;

  @ApiProperty({
    title: '自取品牌',
    example: '1',
    description: '品牌門市自取類型的所屬品牌'
  })
  pickupBrand: string;

  @ApiProperty({
    title: '自取門市',
    example: '1',
    description: '品牌門市自取類型的所屬門市'
  })
  pickupStore: string;
}

export class ImportOrderInfo {
  @ApiProperty({
    title: '操作補登的人員帳號',
    example: 'ste',
    description: '角色帳號'
  })
  memberAccount: string;

  @ApiProperty({
    title: '操作補登的人員名稱',
    example: 'wei',
    description: '角色名稱'
  })
  memberName: string;

  @ApiProperty({
    title: '補登備註',
    example: '2023-07-24 補登',
    description: '補登備註'
  })
  memberRemark: string;
}

export class GetOrderDetailResp {
  @ApiProperty({
    title: '交易時間',
    example: '2023-07-21T07:07:04.000Z',
    description: '交易時間'
  })
  transactionTime: string;

  @ApiProperty({
    title: '交易序號',
    example: 'i12345678901234',
    description: '交易序號'
  })
  transactionCode: string;

  @ApiProperty({
    title: '渠道名稱',
    example: '門市 POS',
    description: '渠道所設定名稱'
  })
  channelName: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '饗',
    description: '品牌所設定的名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '門市名稱',
    example: '1',
    description: '門市所設定的名稱'
  })
  storeName: string;

  @ApiProperty({
    title: '手機國碼',
    default: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    default: '9123456789',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '會員名稱',
    default: '王小明',
    description: '會員姓名'
  })
  memberName: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'test1234',
    description: '卡號'
  })
  memberCardId: string;

  @ApiProperty({
    title: '交易類型',
    example: '1',
    description: '交易類型，SALE: 銷售; RETURN: 退貨'
  })
  transactionType: string;

  @ApiProperty({
    title: '付款方式名稱',
    example: 'Line Pay',
    description: '依照支付設定'
  })
  paymentMethodName: string;

  @ApiProperty({
    title: '發票',
    example: 'i12345',
    description: '發票'
  })
  invoiceNumber: string;

  @ApiProperty({
    title: '折扣點數',
    example: '200',
    description: '折扣點數'
  })
  pointDeduction: number;

  @ApiProperty({
    title: '原始金額',
    example: '1000',
    description: '原始金額'
  })
  originalAmount: number;

  @ApiProperty({
    title: '實付金額',
    example: '100',
    description: '實付金額'
  })
  paidAmount: number;

  @ApiProperty({
    title: '折扣金額',
    example: '200',
    description: '折扣金額'
  })
  discountAmount: number;

  @ApiProperty({
    title: '運費',
    example: '200',
    description: '運輸費用'
  })
  shippingFee: number;

  @ApiProperty({ type: [OrderProductList] })
  orderProductList: OrderProductList[];

  @ApiProperty({ type: [OrderDeliveryInfo] })
  orderDeliveryInfo: OrderDeliveryInfo;

  @ApiProperty({ type: ImportOrderInfo })
  importOrderInfo: ImportOrderInfo;
}
