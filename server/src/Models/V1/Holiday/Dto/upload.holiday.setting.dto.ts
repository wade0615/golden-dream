import { ApiProperty } from '@nestjs/swagger';

export class HolidayExcelData {
  @ApiProperty({
    title: '西元日期',
    example: '01/01',
    description: '西元日期'
  })
  date: string;

  @ApiProperty({
    title: '星期',
    example: '日',
    description: '星期'
  })
  week: string;

  @ApiProperty({
    title: '備註',
    example: '元旦',
    description: '備註'
  })
  remark: string;
}

export class UploadHolidaySettingResp {
  @ApiProperty({
    title: '筆數',
    example: '100',
    description: '筆數'
  })
  totalCount: number;

  @ApiProperty({ type: [HolidayExcelData] })
  holidayExcelData: HolidayExcelData[];
}
