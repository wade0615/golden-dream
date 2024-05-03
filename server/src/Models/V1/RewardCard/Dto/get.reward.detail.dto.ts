import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetRewardDetailDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '集點卡1',
    description: '手機/卡號/集點卡名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'mobile: 手機/member_card: 卡號/reward_name: 集點卡名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

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
    title: '發卡開始時間',
    example: '2023-08-15 00:00:00',
    description: '發卡開始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  sendCardStartDate: string;

  @ApiProperty({
    title: '發卡結束時間',
    example: '2023-08-15 00:00:00',
    description: '發卡結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  sendCardEndDate: string;

  @ApiProperty({
    title: '異動開始日',
    example: '2023-08-15 00:00:00',
    description: '異動開始日',
    required: false
  })
  @IsString()
  @IsOptional()
  alterStartDate: string;

  @ApiProperty({
    title: '異動結束日',
    example: '2023-08-15 00:00:00',
    description: '異動結束日',
    required: false
  })
  @IsString()
  @IsOptional()
  alterEndDate: string;

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

export class RewardDetail {
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

  @ApiProperty({
    title: '會員卡號',
    example: 'i123456789',
    description: '會員卡號'
  })
  memberCardId: string;

  @ApiProperty({
    title: '會員姓名',
    example: '王小明',
    description: '會員名稱'
  })
  memberName: string;

  @ApiProperty({
    title: '手機號碼',
    example: '912345678',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;
  endDate: string;
}

export class GetRewardDetailResp {
  @ApiProperty({ type: [RewardDetail] })
  rewardDetail: RewardDetail[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
