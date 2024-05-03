import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MemberRegisterDto {
  @ApiProperty({
    title: '會員ID',
    example: 'M230007123',
    description: '會員ID',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

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
    title: '手機國碼',
    example: '+886',
    description: '手機國碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '9123456789',
    description: '手機號碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

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
    required: false
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    title: '電話',
    description: '家用電話',
    required: false
  })
  @IsString()
  @IsOptional()
  homePhone: string;

  @ApiProperty({
    title: '發票載具代碼',
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
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    title: '輸入推薦碼',
    description: '推薦人的推薦碼',
    required: false
  })
  @IsString()
  @IsOptional()
  referrerCode: string;

  @ApiProperty({
    title: '地址資訊',
    description: '地址資訊',
    required: true
  })
  @IsString()
  @IsOptional()
  addressCode: string;

  @ApiProperty({
    title: '渠道',
    required: true
  })
  @IsString()
  @IsOptional()
  channelData: string;
}
