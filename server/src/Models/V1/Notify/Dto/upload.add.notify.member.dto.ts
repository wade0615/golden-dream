import { ApiProperty } from '@nestjs/swagger';

export class AddNotifyExcelData {
  name: string;
  mobileCountryCode: string;
  mobile: string;
  email: string;
  className: string;
  classSeqs: number[];
}

export class UploadAddNotifyMemberResp {
  @ApiProperty({
    title: '筆數',
    example: '100',
    description: '筆數'
  })
  totalCount: number;
  notifyExcelData: AddNotifyExcelData[];
}
