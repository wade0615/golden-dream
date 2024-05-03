import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetMemberRewardDetailDto {
  @ApiProperty({
    title: '會員id',
    example: 'test1234',
    description: 'Member ID',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '品牌代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '開始時間',
    example: '2023-06-26T15:03:38.000Z',
    description: '開始時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '結束時間',
    example: '2023-06-26T15:03:38.000Z',
    description: '結束時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

export class MemberRewardDetail {
  @ApiProperty({
    title: '品牌名稱',
    default: '旭集',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '集點卡名稱',
    default: '集點卡1',
    description: '集點卡名稱'
  })
  rewardCardName: string;

  @ApiProperty({
    title: '狀態',
    default: '1',
    description: '1: 集點中 2: 已集滿 3: 已到期'
  })
  state: number;

  @ApiProperty({
    title: '交易 ID',
    example: 'T230817000001',
    description: '交易編號'
  })
  transactionId: string;

  @ApiProperty({
    title: '交易項目',
    example: '1',
    description:
      '1: 滿點自動兌換 2: 消費回饋 3: 退貨返點 4: 調整集點 5: 集點過期 6: 點數轉移'
  })
  transactionType: number;

  @ApiProperty({
    title: '點數',
    example: '1',
    description: '獲得的點數'
  })
  point: number;

  @ApiProperty({
    title: '滿點點數',
    example: '18',
    description: '集點卡的滿點設定'
  })
  maxPoint: number;

  @ApiProperty({
    title: '累計點數',
    example: '1',
    description: '當下剩餘的點數'
  })
  lastPoint: number;

  @ApiProperty({
    title: '發卡日',
    example: '2023-06-26T15:03:38.000Z',
    description: '發卡日'
  })
  sendCardDate: string;

  @ApiProperty({
    title: '異動日',
    example: '2023-06-26T15:03:38.000Z',
    description: '異動日'
  })
  alterDate: string;

  @ApiProperty({
    title: '到期日',
    example: '2023-06-26T15:03:38.000Z',
    description: '到期日'
  })
  expirationDate: string;
}

export class GetMemberRewardDetailResp {
  @ApiProperty({
    title: '集點卡進行中的數量',
    example: '2',
    description: '集點卡進行中的數量'
  })
  rewardPointIngCount: number;

  @ApiProperty({
    title: '集點卡已集滿的數量',
    example: '1',
    description: '集點卡已集滿的數量'
  })
  rewardPointFullCount: number;

  @ApiProperty({
    title: '集點卡已過期的數量',
    example: '1',
    description: '集點卡已過期的數量'
  })
  rewardPointExpirationCount: number;

  @ApiProperty({ type: [MemberRewardDetail] })
  memberRewardDetail: MemberRewardDetail[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
