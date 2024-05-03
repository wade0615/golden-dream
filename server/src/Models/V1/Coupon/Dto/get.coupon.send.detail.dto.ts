import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCouponSendDetailDto {
  @ApiProperty({
    title: '發放 ID',
    example: 'C230811006',
    description: '發放編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  sendId: string;
}

export class CouponSendDetail {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券編號'
  })
  couponId: string;

  @ApiProperty({
    title: '兌換券名稱',
    example: '兌換券001',
    description: '兌換券名稱'
  })
  couponName: string;

  @ApiProperty({
    title: '兌換券類型',
    example: '1',
    description: '1: 優惠券; 2: 商品券'
  })
  couponType: number;
}

export class GetCouponSendDetailResp {
  @ApiProperty({
    title: '發放項目名稱',
    example: '測試發送優惠券',
    description: '發放項目名稱'
  })
  name: string;

  @ApiProperty({
    title: '指定發放日',
    example: '2023-07-13',
    description: '指定發放日'
  })
  cisDate: string;

  @ApiProperty({ type: [CouponSendDetail] })
  couponSendDetail: CouponSendDetail[];

  @ApiProperty({
    title: '發放指定的會員手機國碼',
    example: '+886',
    description: '會員手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '發放指定的會員手機號碼',
    example: '912345678',
    description: '會員手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '備註',
    example: '',
    description: '備註'
  })
  remark: string;

  @ApiProperty({
    title: '指定會員 Excel',
    example: 'https://localhost/',
    description: 'excel url'
  })
  memberExcelUrl: string;

  @ApiProperty({
    title: '會員名稱',
    example: '王大明',
    description: '會員名稱'
  })
  memberName: string;

  @ApiProperty({
    title: '會員資料筆數',
    example: '10',
    description: '會員資料筆數'
  })
  memberExcelCount: number;
}
