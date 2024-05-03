import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetCouponSendListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '發放項目名稱',
    description: '關鍵字搜尋欄，發放項目名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'coupon_send_name',
    description: 'coupon_send_name: 發放項目名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '兌換券發放狀態',
    example: 'NOT_START',
    description: 'NOT_START: 尚未開始; END: 已結束',
    required: false
  })
  @IsString()
  @IsOptional()
  state: string;

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

export class CouponSendList {
  @ApiProperty({
    title: '發放 ID',
    example: 'C230811006',
    description: '發放 ID'
  })
  id: string;

  @ApiProperty({
    title: '發放項目名稱',
    example: '測試發送優惠券',
    description: '發放項目名稱'
  })
  name: string;

  @ApiProperty({
    title: '發放類別',
    example: '1',
    description: '1: 即時、2: 指定發放日、3：排程發放'
  })
  cisType: number;

  @ApiProperty({
    title: '指定發放日',
    example: '2023-07-13',
    description: '指定發放日'
  })
  cisDate: string;

  @ApiProperty({
    title: '備註',
    example: '',
    description: '備註'
  })
  remark: string;

  @ApiProperty({
    title: '兌換券類型',
    example: '1',
    description: '1: 優惠券; 2: 商品券'
  })
  couponType: number;

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-13T07:16:14.000Z',
    description: '建立時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wright',
    description: '建立人員'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-13T07:16:14.000Z',
    description: '更新時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wright',
    description: '更新人員'
  })
  alterName: string;
}

export class GetCouponSendListResp {
  @ApiProperty({ type: [CouponSendList] })
  couponSendList: CouponSendList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
