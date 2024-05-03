import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberCouponDetailByRedeemIdDto {
  @ApiProperty({
    title: '核銷品牌 ID',
    example: 'TT',
    description: '依照品牌管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    title: '核銷門市 ID',
    example: 'S2212290072',
    description: '依照門市管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    title: '兌換券核銷類型',
    example: 'WRITE_OFF',
    description: 'WRITE_OFF: 核銷; CANCEL_WRITE_OFF: 取消核銷',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  methods: string;

  @ApiProperty({
    title: '兌換券 ID',
    example: 'R23081700001',
    description: '兌換券編碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  redeemId: string;
}

export class GetMemberCouponDetailByRedeemIdResp {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'R23081700001',
    description: '兌換券編號'
  })
  redeemId: string;

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

  @ApiProperty({
    title: '品牌名稱',
    examples: ['旭集', '饗泰多'],
    description: '品牌名稱'
  })
  brandNames: string[];

  @ApiProperty({
    title: '會員名稱',
    example: '王小明',
    description: '會員名稱'
  })
  memberName: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'i123456789',
    description: '會員卡號'
  })
  memberCardId: string;
}
