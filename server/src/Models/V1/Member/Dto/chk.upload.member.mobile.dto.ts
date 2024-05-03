import { ApiProperty } from '@nestjs/swagger';

export class ChkUploadMemberMobileResp {
  @ApiProperty({
    title: '筆數',
    example: '1',
    description: '筆數'
  })
  totalCount: number;

  @ApiProperty({
    title: 'GCP 網址',
    examples: ['http://127.0.0.1/'],
    description: '上傳至 GCP 網址'
  })
  urls: string[];

  csvTempTableName: string;
  csvSql: string;
}
