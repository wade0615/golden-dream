import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRewardCardSettingDetailDto {
  @ApiProperty({
    title: '集點卡 ID',
    example: 'RC2308150001',
    description: '集點卡編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  rewardCardId: string;
}

export class CouponDetail {
  @ApiProperty({
    title: '兌換點數',
    example: '10',
    description: '兌換點數'
  })
  point: number;

  @ApiProperty({
    title: '品牌名稱',
    examples: ['旭集', '17Life'],
    description: '品牌名稱'
  })
  brandNames: string[];

  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090004',
    description: '兌換券編號'
  })
  couponId: string;

  @ApiProperty({
    title: '兌換券類型',
    example: '1',
    description: '1: 優惠券; 2: 商品券'
  })
  couponType: number;

  @ApiProperty({
    title: '兌換券名稱',
    example: '優惠券',
    description: '兌換券名稱'
  })
  couponName: string;

  @ApiProperty({
    title: '發佈狀態',
    example: '1',
    description: '1: 已發佈; 2: 未發佈'
  })
  releaseStatus: number;

  @ApiProperty({
    title: '兌換規則',
    example: '1',
    description: '1: 指定時間; 2: 指定天數'
  })
  couponRule: number;

  @ApiProperty({
    title: '上架時間',
    example: '',
    description: '上架時間'
  })
  startDate: string;

  @ApiProperty({
    title: '下架時間',
    example: '',
    description: '下架時間'
  })
  endDate: string;

  @ApiProperty({
    title: '兌換起始時間',
    example: '',
    description: '兌換起始時間'
  })
  redemptionStartDate: string;

  @ApiProperty({
    title: '兌換結束時間',
    example: '',
    description: '兌換結束時間'
  })
  redemptionEndDate: string;

  @ApiProperty({
    title: '最快可取貨日',
    example: '1',
    description: '最快可取貨日'
  })
  earliestPickupDate: string;

  @ApiProperty({
    title: '取貨期限',
    example: '',
    description: '取貨期限'
  })
  pickupDeadline: string;
}

export class RewardCardSettingDetail {
  @ApiProperty({
    title: '集點卡名稱',
    example: '集點卡1',
    description: '集點卡名稱'
  })
  rewardCardName: string;

  @ApiProperty({
    title: '發佈狀態',
    example: 'true',
    description: '發佈狀態'
  })
  releaseStatus: boolean;

  @ApiProperty({
    title: '主圖',
    example: 'https://localhost/',
    description: '主圖URL'
  })
  mainImageUrl: string;

  @ApiProperty({
    title: '縮圖',
    example: 'https://localhost/',
    description: '縮圖URL'
  })
  thumbnailImageUrl: string;

  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '品牌代碼'
  })
  brandId: string;

  @ApiProperty({
    title: '集點卡類別',
    example: '1',
    description: '1: 一般'
  })
  rewardCardCategory: number;

  @ApiProperty({
    title: '集滿點數',
    example: '10',
    description: '集滿點數'
  })
  maxPoint: number;

  @ApiProperty({
    title: '集點規則',
    example: '100',
    description: '集點規則'
  })
  ruleAmount: number;

  @ApiProperty({
    title: '是否滿點自動兌換',
    example: 'true',
    description: 'true: 是; false: 否'
  })
  isAutoExchange: boolean;

  @ApiProperty({
    title: '上架時間',
    example: '',
    description: '上架時間'
  })
  startDate: string;

  @ApiProperty({
    title: '下架時間',
    example: '',
    description: '下架時間'
  })
  endDate: string;

  @ApiProperty({
    title: '使用說明',
    example: '',
    description: '使用說明(HTML)'
  })
  content: string;
}

export class GetRewardCardSettingDetailResp {
  @ApiProperty({ type: RewardCardSettingDetail })
  rewardCardSettingDetail: RewardCardSettingDetail;

  @ApiProperty({ type: [CouponDetail] })
  couponDetails: CouponDetail[];
}
