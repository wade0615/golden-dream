import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetCouponSettingListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '生日',
    description: '關鍵字搜尋欄，兌換券名稱、兌換券ID',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'coupon_name: 兌換券名稱/ coupon_id: 兌換券ID',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '狀態',
    example: 'ING',
    description: 'ING: 進行中; END: 已結束; NOT_START:  尚未開始',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    title: '核銷渠道',
    example: 'CH00001',
    description: '依照渠道管理設定',
    required: false
  })
  @IsString()
  @IsOptional()
  channelId: string;

  @ApiProperty({
    title: '適用品牌',
    example: 'TT',
    description: '依照品牌管理設定',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '兌換類型',
    example: '0',
    description: '0: 全部; 1: 優惠券; 2: 商品券',
    required: false
  })
  @IsNumber()
  @IsOptional()
  exchangeType: number;

  @ApiProperty({
    title: '發放規則',
    example: '0',
    description:
      '0: 全部; 1: 普通兌換; 2: 手動發放; 3: 集點卡兌換; 4: 註冊禮; 5: 續會禮; 6: 升等禮; 7: 生日禮',
    required: false
  })
  @IsNumber()
  @IsOptional()
  sendType: number;

  @ApiProperty({
    title: '領取等級',
    example: 'C10001',
    description: '依照會籍管理設定',
    required: false
  })
  @IsString()
  @IsOptional()
  levelId: string;

  @ApiProperty({
    title: '發佈狀態',
    example: '0',
    description: '0: 全部; 1: 已發佈; 2: 未發佈',
    required: false
  })
  @IsNumber()
  @IsOptional()
  releaseState: number;

  @ApiProperty({
    title: '排除的兌換券 ID',
    examples: ['C2308010001', 'C2308010002'],
    description: '欲排除的兌換券 ID',
    required: false
  })
  @IsArray()
  @IsOptional()
  excludeCouponIds: string[];

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

export class CouponSettingList {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券編號'
  })
  id: string;

  @ApiProperty({
    title: '兌換券名稱',
    example: '80摳-折扣券',
    description: '兌換券名稱'
  })
  channelName: string;

  @ApiProperty({
    title: '適用品牌',
    examples: ['17Life', '旭集'],
    description: '適用品牌'
  })
  brandNames: string;

  @ApiProperty({
    title: '兌換券類型',
    example: '1',
    description: '1: 優惠券; 2: 商品券'
  })
  couponType: number;

  @ApiProperty({
    title: '發放規則',
    example: '0',
    description:
      '0: 全部; 1: 普通兌換; 2: 手動發放; 3: 集點卡兌換; 4: 註冊禮; 5: 續會禮; 6: 升等禮; 7: 生日禮'
  })
  rewardRule: number;

  @ApiProperty({
    title: '兌換券名稱',
    example: '80摳-折扣券',
    description: '兌換券名稱'
  })
  couponName: string;

  @ApiProperty({
    title: '兌換點數',
    example: '10',
    description: '兌換點數'
  })
  point: number;

  @ApiProperty({
    title: '發佈狀態',
    example: '1',
    description: '1: 已發佈; 2: 未發佈'
  })
  releaseStatus: boolean;

  @ApiProperty({
    title: '上架時間',
    example: '2023-08-15 00:00:00',
    description: '上架時間'
  })
  startDate: string;

  @ApiProperty({
    title: '下架時間',
    example: '2023-08-15 00:00:00',
    description: '下架時間'
  })
  endDate: string;

  @ApiProperty({
    title: '兌換起始時間',
    example: '2023-08-15 00:00:00',
    description: '兌換起始時間'
  })
  couponStartDate: string;

  @ApiProperty({
    title: '兌換結束時間',
    example: '2023-08-15 00:00:00',
    description: '兌換結束時間'
  })
  couponEndDate: string;

  @ApiProperty({
    title: '兌換券已兌換數量',
    example: '100',
    description: '兌換券已兌換數量'
  })
  lastCount: number;

  @ApiProperty({
    title: '圖片',
    example: 'https://localhost/',
    description: '圖片URL'
  })
  couponImgUrl: string;

  @ApiProperty({
    title: '發行數量',
    example: '1000',
    description: '發行數量'
  })
  quantity: number;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '兌換券建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '兌換券建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023/06/19 17:27:37',
    description: '兌換券更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '兌換券更新資料的角色'
  })
  alterName: string;

  @ApiProperty({
    title: '兌換規則',
    example: '1',
    description: '1: 指定時間; 2: 指定天數'
  })
  couponRule: number;

  @ApiProperty({
    title: '最快取貨日',
    example: '3',
    description: 'D+N'
  })
  earliestPickupDate: string;
}

export class GetCouponSettingListResp {
  @ApiProperty({ type: [CouponSettingList] })
  couponSettingList: CouponSettingList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
