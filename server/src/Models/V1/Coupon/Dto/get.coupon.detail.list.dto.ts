import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetCouponDetailListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '發放項目名稱',
    description: '手機/卡號/兌換券名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'mobile: 手機/member_card: 卡號/coupon_name: 兌換券名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '狀態',
    example: '0',
    description:
      '0: 全部; 1: 可使用; 2: 已核銷; 3:已到期; 4: 已轉贈; 5: 已退貨',
    required: false
  })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({
    title: '兌換券類型',
    example: '1',
    description: '1: 優惠券; 2: 商品券',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  couponType: number;

  @ApiProperty({
    title: '渠道編號',
    example: 'Ch0000',
    description: '渠道編號',
    required: false
  })
  @IsString()
  @IsOptional()
  channelId: string;

  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '發放規則',
    example: '0',
    description:
      '0: 全部; 1: 普通兌換; 2: 手動發放; 3: 集點卡兌換; 4: 註冊禮; 5: 續會禮; 6: 升等禮; 7: 生日禮',
    required: false
  })
  @IsNumber()
  @IsOptional()
  rewardRule: number;

  @ApiProperty({
    title: '交易開始時間',
    example: '2023-08-15 00:00:00',
    description: '交易開始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  transactionStartDate: string;

  @ApiProperty({
    title: '交易結束時間',
    example: '2023-08-15 00:00:00',
    description: '交易結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  transactionEndDate: string;

  @ApiProperty({
    title: '核銷開始時間',
    example: '2023-08-15 00:00:00',
    description: '核銷開始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  writeOffStartDate: string;

  @ApiProperty({
    title: '核銷結束時間',
    example: '2023-08-15 00:00:00',
    description: '核銷結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  writeOffEndDate: string;

  @ApiProperty({
    title: '頁數',
    example: '1',
    description: '頁數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '每頁筆數',
    example: '20',
    description: '每頁筆數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  perPage: number;
}

export class CouponDetailList {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券編號'
  })
  couponId: string;

  @ApiProperty({
    title: '適用品牌',
    examples: ['17Life', '旭集'],
    description: '適用品牌'
  })
  brandNames: string[];

  @ApiProperty({
    title: '渠道名稱',
    example: '門市 POS',
    description: '核銷渠道'
  })
  channelName: string;

  @ApiProperty({
    title: '發放規則',
    example: '0',
    description:
      '0: 全部; 1: 普通兌換; 2: 手動發放; 3: 集點卡兌換; 4: 註冊禮; 5: 續會禮; 6: 升等禮; 7: 生日禮'
  })
  rewardRule: string;

  @ApiProperty({
    title: '兌換券名稱',
    example: '兌換券001',
    description: '兌換券名稱'
  })
  couponName: string;

  @ApiProperty({
    title: '交易狀態',
    example: '1',
    description: '1.可使用 2. 已核銷 3. 已到期 4. 已轉贈 5. 已退貨'
  })
  transactionType: number;

  @ApiProperty({
    title: '兌換積點',
    example: '0',
    description: '積點兌換使用的點數'
  })
  point: number;

  @ApiProperty({
    title: '兌換集點',
    example: '0',
    description: '集點卡兌換使用的點數'
  })
  reward: number;

  @ApiProperty({
    title: '會員姓名',
    example: '0',
    description: '會員名稱'
  })
  memberName: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'i123456789',
    description: '會員卡號'
  })
  memberCardId: string;

  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '912345678',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '到期日',
    example: '2023-08-31 00:00:00',
    description: '到期日'
  })
  couponEndDate: string;

  @ApiProperty({
    title: '轉贈日',
    example: '2023-08-31 00:00:00',
    description: '轉贈日'
  })
  transferDate: string;

  @ApiProperty({
    title: '核銷日',
    example: '2023-08-31 00:00:00',
    description: '核銷日'
  })
  writeOffDate: string;

  @ApiProperty({
    title: '退貨日',
    example: '2023-08-31 00:00:00',
    description: '退貨日'
  })
  returnDate: string;

  @ApiProperty({
    title: '核銷門市名稱',
    example: '微風信義店',
    description: '核銷門市名稱'
  })
  writeOffStoreName: string;

  @ApiProperty({
    title: '交易日',
    example: '2023-08-31 00:00:00',
    description: '交易日'
  })
  transactionDate: string;

  @ApiProperty({
    title: '交易 ID',
    example: 'T230817000001',
    description: '交易編號'
  })
  transactionId: string;

  @ApiProperty({
    title: '受贈會員卡號',
    example: 'i10000001',
    description: '受贈會員卡號'
  })
  transferMemberCardId: string;

  @ApiProperty({
    title: '核銷優惠券/商品券編碼',
    example: 'R231130000002',
    description: 'EAN-8 兌換券的兌換碼'
  })
  redeemId: string;
}

export class GetCouponDetailListResp {
  @ApiProperty({ type: [CouponDetailList] })
  couponDetailList: CouponDetailList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
