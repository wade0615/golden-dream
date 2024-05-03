import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCouponSettingDetailDto {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  couponId: string;
}

export class CouponBrand {
  @ApiProperty({
    title: '渠道 ID',
    example: 'Ch0000',
    description: '渠道編號'
  })
  couponId: string;

  @ApiProperty({
    title: '品牌 ID',
    example: 'TT',
    description: '品牌代號'
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '17Life',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '是否為集團店',
    example: 'true',
    description: '集團店狀態，true: 是 false: 否'
  })
  isCorporation: boolean;
}

export class CouponStore {
  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '品牌代碼'
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '17Life',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '門市代碼',
    example: 'S2212290072',
    description: '門市代碼'
  })
  storeId: string;

  @ApiProperty({
    title: '門市名稱',
    example: '台北101 87樓店',
    description: '門市名稱'
  })
  storeName: string;

  @ApiProperty({
    title: '城市代碼',
    example: '10000',
    description: '城市代碼'
  })
  cityCode: string;

  @ApiProperty({
    title: '區域代碼',
    example: '20001',
    description: '區域代碼'
  })
  zipCode: string;

  @ApiProperty({
    title: '商場名稱',
    example: '101大樓',
    description: '商場名稱'
  })
  mallName: string;

  @ApiProperty({
    title: 'POST 商店代碼',
    default: 'KH011',
    description: 'POS 商店代碼'
  })
  posStore: string;
}

export class CouponSettingDetail {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券 ID'
  })
  couponId: string;

  @ApiProperty({
    title: '兌換券類型',
    example: 2,
    description: '兌換券類型'
  })
  couponType: number;

  @ApiProperty({
    title: '兌換券名稱',
    example: '80摳-折扣券',
    description: '兌換券名稱'
  })
  couponName: string;

  @ApiProperty({
    title: '主圖',
    example: 'https://localhost/',
    description: '圖片URL'
  })
  mainImageUrl: string;

  @ApiProperty({
    title: '縮圖',
    example: 'https://localhost/',
    description: '圖片URL'
  })
  thumbnailImageUrl: string;

  @ApiProperty({
    title: '發放渠道',
    example: 'Ch00001',
    description: '依照渠道管理設定'
  })
  assignChannelId: string;

  @ApiProperty({
    title: '核銷渠道',
    example: 'Ch00001',
    description: '依照渠道管理設定'
  })
  writeoffChannelId: string;

  @ApiProperty({
    title: '發放規則',
    example: '1',
    description:
      '1: 普通兌換; 2: 手動發放; 3: 集點卡兌換; 4: 註冊禮; 5: 續會禮; 6: 升等禮; 7: 生日禮'
  })
  rewardRule: string;

  @ApiProperty({
    title: '兌換點數',
    example: '10',
    description: '兌換點數'
  })
  point: number;

  @ApiProperty({
    title: '最快取貨日',
    example: '3',
    description: 'D+N'
  })
  earliestPickupDate: string;

  @ApiProperty({
    title: '取貨期限',
    example: '',
    description: '商品券取貨期限'
  })
  pickupDeadline: string;

  @ApiProperty({
    title: '發佈狀態',
    example: '1',
    description: '1: 已發佈; 2: 未發佈'
  })
  releaseStatus: number;

  @ApiProperty({
    title: '發佈時間',
    example: '',
    description: '已發佈的時間'
  })
  releaseDate: string;

  @ApiProperty({
    title: '生日年',
    example: '2023',
    description: '生日禮的指定年份'
  })
  birthdayYear: string;

  @ApiProperty({
    title: '生日月',
    example: '12',
    description: '生日禮的指定月份'
  })
  birthdayMonth: string;

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
    title: '兌換規則',
    example: '1',
    description: '1: 指定時間; 2: 指定天數'
  })
  couponRule: number;

  @ApiProperty({
    title: '兌換起始時間',
    example: '',
    description: '兌換起始時間'
  })
  couponStartDate: string;

  @ApiProperty({
    title: '兌換結束時間',
    example: '',
    description: '兌換結束時間'
  })
  couponEndDate: string;

  @ApiProperty({
    title: '是否可轉贈',
    example: 'true',
    description: '是否可轉贈'
  })
  isTransferable: boolean;

  @ApiProperty({
    title: '發行數量',
    example: '1000',
    description: '發行數量'
  })
  quantity: number;

  @ApiProperty({
    title: '會員已領取',
    example: '900',
    description: '會員已領取數量'
  })
  memberReceiveCount: number;

  @ApiProperty({
    title: '剩餘數量',
    example: '100',
    description: '剩餘數量'
  })
  lastCount: number;

  @ApiProperty({
    title: '領取上限',
    example: '1',
    description: '領取上限'
  })
  redeemLimit: number;

  @ApiProperty({
    title: '使用說明',
    example: '',
    description: '使用說明(HTML)'
  })
  description: string;

  @ApiProperty({
    title: '最後更新時間',
    example: '',
    description: '最後更新時間'
  })
  alterTime: string;
}

export class GetCouponSettingDetailResp {
  @ApiProperty({ type: CouponSettingDetail })
  couponDetail: CouponSettingDetail;

  @ApiProperty({ type: [CouponBrand] })
  brands: CouponBrand[];

  @ApiProperty({ type: [CouponStore] })
  stores: CouponStore[];

  @ApiProperty({
    title: '領取等級',
    examples: ['M00101', 'M00102'],
    description: '商場名稱'
  })
  memberShips: string[];
}
