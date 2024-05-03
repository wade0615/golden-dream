import { ApiProperty } from '@nestjs/swagger';

export class ExcelData {
  @ApiProperty({
    title: '會員編號',
    example: 'M0000001',
    description: '會員編號'
  })
  id: string;

  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '9123456789',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '調整積點',
    example: '20',
    description: '調整積點'
  })
  point: string;
}

export class UploadMemberPointResp {
  @ApiProperty({
    title: '筆數',
    example: '1',
    description: '筆數'
  })
  totalCount: number;

  @ApiProperty({ type: [ExcelData] })
  excelData: ExcelData[];

  @ApiProperty({
    title: 'GCP 網址',
    examples: ['http://127.0.0.1/'],
    description: '上傳至 GCP 網址'
  })
  urls: string[] | string;

  @ApiProperty({
    title: '檔案暫時的名稱',
    description: '檔案暫時的名稱'
  })
  tempFileName: string;
}
