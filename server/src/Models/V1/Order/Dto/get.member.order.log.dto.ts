import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetMemberOrderLogDto {
  @ApiProperty({
    title: '會員ID',
    example: 'M000001',
    description: '依會員表設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    title: '渠道ID',
    example: 'CH0000',
    description: '依渠道資料設定',
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
    description: '交易開始時間',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '結束日期',
    example: '2023/06/19 13:00:00',
    description: '交易結束時間',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    title: '頁數',
    example: '1',
    description: '當前頁數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '筆數',
    example: '20',
    description: '每頁筆數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

export class MemberOrderList {
  @ApiProperty({
    title: '訂單流水號',
    example: '1',
    description: '訂單流水號'
  })
  orderSeq: number;

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
    example: '1',
    description: '交易類型，SALE: 銷售; RETURN: 退貨'
  })
  transactionType: string;

  @ApiProperty({
    title: '實付金額',
    example: '10',
    description: '實付金額'
  })
  amount: number;

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
}

export class GetMemberOrderLogResp {
  @ApiProperty({
    title: '年度消費次數',
    example: '20',
    description: '年度消費次數'
  })
  payCount: number;

  @ApiProperty({
    title: '年度消費金額',
    example: '22900',
    description: '年度消費金額'
  })
  payAmount: number;

  @ApiProperty({
    title: '年度退款次數',
    example: '2',
    description: '年度退款次數'
  })
  refundCount: number;

  @ApiProperty({
    title: '年度退款金額',
    example: '3000',
    description: '年度退款金額'
  })
  refundAmount: number;

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;

  @ApiProperty({ type: [MemberOrderList] })
  orderList: MemberOrderList[];
}
