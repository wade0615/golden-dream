import { ApiProperty } from '@nestjs/swagger';

export class NotifyExcelData {
  id: string;
  mobileCountryCode: string;
  mobile: string;
}

export class UploadDelMobileExcelResp {
  @ApiProperty({
    title: '筆數',
    example: '100',
    description: '筆數'
  })
  totalCount: number;
  excelData: NotifyExcelData[];
}
