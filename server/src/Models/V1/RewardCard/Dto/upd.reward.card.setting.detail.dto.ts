import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdCouponDetail {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090004',
    description: '兌換券編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  couponId: string;

  @ApiProperty({
    title: '兌換券點數',
    example: '10',
    description: '兌換券點數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  point: number;
}

export class UpdRewardCardSettingDetailDto {
  @ApiProperty({
    title: '集點卡 ID',
    example: 'RC2308150001',
    description: '集點卡編號',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardCardId: string;

  @ApiProperty({
    title: '集點卡名稱',
    example: '集點卡1',
    description: '集點卡名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  rewardCardName: string;

  @ApiProperty({
    title: '發佈狀態',
    example: '1',
    description: '1: 已發佈; 2: 未發佈',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  releaseStatus: number;

  @ApiProperty({
    title: '主圖',
    example: 'https://localhost/',
    description: '主圖URL',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mainImageUrl: string;

  @ApiProperty({
    title: '縮圖',
    example: 'https://localhost/',
    description: '縮圖URL',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  thumbnailImageUrl: string;

  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '品牌代碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    title: '集點卡類別',
    example: '1',
    description: '1: 一般',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  rewardCardCategory: number;

  @ApiProperty({
    title: '集滿點數',
    example: '10',
    description: '集滿點數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  maxPoint: number;

  @ApiProperty({
    title: '集點規則',
    example: '10',
    description: '集點規則',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  ruleAmount: number;

  @ApiProperty({ type: [UpdCouponDetail] })
  couponDetails: UpdCouponDetail[];

  @ApiProperty({
    title: '是否自動滿點兌換',
    example: 'true',
    description: 'true: 是; false: 否',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  isAutoExchange: boolean;

  @ApiProperty({
    title: '上架時間',
    example: '',
    description: '上架時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '下架時間',
    example: '',
    description: '下架時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    title: '使用說明',
    example: '',
    description: '使用說明(HTML)',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    title: '集點卡效期',
    example: '1',
    description: '1: 同上下架時間 2: 會員首次消費日起算1年	',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  expirationRule: number;

  iam: IamDto;
}
