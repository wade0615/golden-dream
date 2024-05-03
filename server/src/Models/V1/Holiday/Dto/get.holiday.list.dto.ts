import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetHolidaySettingListDto {
  @ApiProperty({
    title: '年度',
    example: '2023',
    description: '年度',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    title: '排序的順序',
    example: 'DESC',
    description: '排序的順序，DESC: 反序; ASC: 正序',
    required: true,
  })
  @IsString()
  @IsOptional()
  orderByType: string;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

export class HolidaySettingList {
  @ApiProperty({
    title: '西元日期',
    example: '01/01',
    description: '西元日期',
  })
  date: string;

  @ApiProperty({
    title: '星期',
    example: '日',
    description: '星期',
  })
  week: string;

  @ApiProperty({
    title: '備註',
    example: '元旦',
    description: '備註',
  })
  remark: string;
}

export class GetHolidaySettingListResp {
  @ApiProperty({ type: [HolidaySettingList] })
  holidayList: HolidaySettingList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
