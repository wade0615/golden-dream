import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetMemberDetailDto {
  @ApiProperty({
    title: '會員編號',
    example: 'M00000001',
    description: '長度為10的會員編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class GetSmsInfo {
  @ApiProperty()
  @IsString()
  @IsOptional()
  verifyCode: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  expireTime: any;
}

export class GetMemberDetailResp {
  @ApiProperty({
    title: '會員名稱',
    example: '王小明',
    description: '會員姓名'
  })
  name: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'test1234',
    description: '卡號'
  })
  cardNumber: string;

  @ApiProperty({
    title: '生日',
    example: '2023/01/01',
    description: '生日日期'
  })
  birthday: string;

  @ApiProperty({
    title: '性別',
    example: 'M',
    description: 'M: 男, F:女, S:保密'
  })
  gender: string;

  @ApiProperty({
    title: '電子郵件',
    example: '17Life@gmail.com',
    description: 'E-mail'
  })
  gmail: string;

  @ApiProperty({
    title: '推薦人名稱',
    example: '王大明',
    description: '推薦人的姓名'
  })
  recommenderName: string;

  @ApiProperty({
    title: '推薦人卡號',
    example: 'i9876543210',
    description: '推薦人的卡號'
  })
  recommenderCardNumber: string;

  @ApiProperty({
    title: '註冊時間',
    example: '2023/06/19 16:50:54',
    description: '會員創建的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '個人推薦碼',
    example: 'HouHouGPT',
    description: '推薦碼'
  })
  referralCode: string;

  @ApiProperty({
    title: '城市代碼',
    example: '400',
    description: '縣市代碼'
  })
  cityCode: string;

  @ApiProperty({
    title: '區域代碼',
    example: '12',
    description: '區域代碼'
  })
  zipCode: string;

  @ApiProperty({
    title: '地址',
    example: '西門路88號88樓',
    description: '地址'
  })
  address: string;

  @ApiProperty({
    title: '電話',
    example: '02-123456789',
    description: '家用電話'
  })
  homePhone: string;

  @ApiProperty({
    title: '發票載具代碼',
    example: '/HouHouGPT',
    description:
      '1: 長度8碼，第一碼必為/，其餘七碼則由數字【0-9】、大寫英文【A-Z】與特殊符號【.】【-】【+】組成, 2: 長度16碼，前兩碼為大寫英文【A-Z】後14碼為數字【0-9】'
  })
  carriersKey: string;

  @ApiProperty({
    title: '備註',
    example: '備註說明',
    description: '備註'
  })
  remark: string;

  @ApiProperty({
    title: '手機號碼',
    example: '9123456789',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機驗證碼',
    example: '1234',
    description: '手機驗證碼'
  })
  mobileCaptcha: string;

  @ApiProperty({
    title: '驗證碼過期時間',
    example: '2023/06/19 17:27:37',
    description: '過期的時間'
  })
  mobileCaptchaExpiredTime: string;

  @ApiProperty({
    title: '會籍',
    example: '星卡',
    description: '根據會籍管理設置'
  })
  membershipStatus: string;

  @ApiProperty({
    title: '會籍',
    example: '星卡',
    description: '根據會籍管理設置'
  })
  smsInfo: GetSmsInfo;

  @ApiProperty({
    title: '特殊會員類型',
    example: '1',
    description: '根據特殊會員設定資料',
    required: false
  })
  specialTypeCode: number;
}
