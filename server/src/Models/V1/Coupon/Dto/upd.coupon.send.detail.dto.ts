import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdCouponSendDetailDto {
  @ApiProperty({
    title: '發放 ID',
    example: 'C230811006',
    description: '發放編號，空值為新增',
    required: false
  })
  @IsString()
  @IsOptional()
  sendId: string;

  @ApiProperty({
    title: '發放項目名稱',
    example: '測試發送優惠券',
    description: '發放項目名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: '發放類別',
    example: '1',
    description: '1: 即時、2: 指定發放日、3：排程發放',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  cisType: number;

  @ApiProperty({
    title: '指定發放日',
    example: '2023-07-13',
    description: '指定發放日',
    required: true
  })
  @IsString()
  @IsOptional()
  cisDate: string;

  @ApiProperty({
    title: '兌換券 ID',
    examples: ['C2308090004'],
    description: '兌換券 ID',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  couponIds: string[];

  @ApiProperty({
    title: '發放指定的會員手機國碼',
    example: '+886',
    description: '會員手機國碼',
    required: false
  })
  @IsString()
  @IsOptional()
  mobileCountryCode: string;

  @ApiProperty({
    title: '發放指定的會員手機號碼',
    example: '912345678',
    description: '會員手機號碼',
    required: false
  })
  @IsString()
  @IsOptional()
  mobile: string;

  @ApiProperty({
    title: '備註',
    example: '',
    description: '備註',
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    title: '指定會員 Excel',
    example: 'https://localhost/',
    description: 'excel url',
    required: false
  })
  @IsString()
  @IsOptional()
  memberExcelUrl: string;
}
