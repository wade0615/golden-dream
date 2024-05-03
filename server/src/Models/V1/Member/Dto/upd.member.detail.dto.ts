import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdMemberDetailDto {
  @ApiProperty({
    title: '會員編號',
    default: 'M00000001',
    description: '長度為10的會員編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    title: '特殊會員類型',
    example: '1',
    description: '根據特殊會員設定資料',
    required: false
  })
  @IsNumber()
  @IsOptional()
  memberSpecialType: number;

  @ApiProperty({
    title: '會員名稱',
    example: '王小明',
    description: '會員姓名',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: '生日',
    example: '2023/01/01',
    description: '生日日期',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  birthday: string;

  @ApiProperty({
    title: '性別',
    example: 'M',
    description: 'M: 男, F:女, S:保密',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    title: '電子郵件',
    example: '17Life@gmail.com',
    description: 'E-mail',
    required: false
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    title: '城市代碼',
    example: '400',
    description: '縣市代碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  cityCode: string;

  @ApiProperty({
    title: '區域代碼',
    example: '12',
    description: '區域代碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({
    title: '地址',
    example: '西門路88號88樓',
    description: '地址',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    title: '電話',
    example: '02-123456789',
    description: '家用電話',
    required: false
  })
  @IsString()
  @IsOptional()
  homePhone: string;

  @ApiProperty({
    title: '發票載具代碼',
    example: '/HouHouGPT',
    description:
      '1: 長度8碼，第一碼必為/，其餘七碼則由數字【0-9】、大寫英文【A-Z】與特殊符號【.】【-】【+】組成, 2: 長度16碼，前兩碼為大寫英文【A-Z】後14碼為數字【0-9】',
    required: false
  })
  @IsString()
  @IsOptional()
  carriersKey: string;

  @ApiProperty({
    title: '備註',
    example: '備註說明',
    description: '備註',
    maxLength: 300,
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;
}
