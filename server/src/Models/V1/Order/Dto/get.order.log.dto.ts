import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetOrderLogDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '0912345678',
    description: '手機/卡號/交易序號',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'mobile: 手機/member_card: 卡號/transaction_id: 交易序號',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '訂單來源',
    example: 'Ch0001',
    description: '依渠道來源設定',
    required: false
  })
  @IsString()
  @IsOptional()
  channelId: string;

  @ApiProperty({
    title: '品牌',
    example: 'TT',
    description: '依品牌代號設定',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '交易類型',
    example: '',
    description: '交易類型，SALE: 銷售; RETURN: 退貨',
    required: false
  })
  @IsString()
  @IsOptional()
  transactionType: string;

  @ApiProperty({
    title: '開始日期',
    example: '2023/06/19 12:00:00',
    description: '註冊開始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty({
    title: '結束日期',
    example: '2023/06/19 13:00:00',
    description: '註冊結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    title: '消費者',
    example: '0: 全部; 1: 會員; 2: 非會員',
    description: '消費者',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  memberType: number;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: false
  })
  @IsNumber()
  @IsOptional()
  perPage: number;
}

export class OrderLogList {
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
    title: '交易類型',
    example: 'SALE',
    description: '交易類型，SALE: 銷售; RETURN: 退貨'
  })
  transactionType: string;

  @ApiProperty({
    title: '實付金額',
    example: '100',
    description: '實付金額'
  })
  amount: number;

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
    title: '會員卡號',
    example: 'test1234',
    description: '卡號'
  })
  memberCardId: string;

  @ApiProperty({
    title: '會員名稱',
    default: '王小明',
    description: '會員姓名'
  })
  memberName: string;

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

  @ApiProperty({
    title: '是否退貨',
    example: 'true',
    description: '是否退貨'
  })
  isReturn: boolean;
}

export class GetOrderLogResp {
  @ApiProperty({ type: [OrderLogList] })
  orderLogList: OrderLogList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
