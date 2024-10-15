import { ApiProperty } from '@nestjs/swagger';

export class commonResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  message: string;
}

export class MenuCommon {
  @ApiProperty({
    title: '流水號',
    example: '1',
    description: 'seq'
  })
  seq: number;

  @ApiProperty({
    title: '特殊類型名稱',
    example: '秘密客',
    description: 'name'
  })
  name: string;
}

export class MenuIdCommon {
  @ApiProperty({
    title: '編號',
    example: '1',
    description: 'id'
  })
  id: string;

  @ApiProperty({
    title: '名稱',
    example: '門市 POS',
    description: 'name'
  })
  name: string;
}

export class MobileCommon {
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
}

export class MetaDataCommon {
  @ApiProperty({
    title: '頁數',
    example: '1',
    description: '當前頁數'
  })
  page: number;

  @ApiProperty({
    title: '筆數',
    example: '20',
    description: '每頁筆數'
  })
  perPage: number;

  @ApiProperty({
    title: '總筆數',
    example: '200',
    description: '資料總數'
  })
  totalCount: number;

  @ApiProperty({
    title: '總頁數',
    example: '10',
    description: '總筆數/每頁筆數'
  })
  totalPages: number;
}
