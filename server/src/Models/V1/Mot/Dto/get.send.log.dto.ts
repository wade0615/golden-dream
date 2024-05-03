import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetSendLogtDto {
  @ApiProperty({
    title: '類型',
    default: 'single',
    description: 'single/regular/mot',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mot_id',
    description: 'mot_id: 群發ID/mot_name: 群發名稱/mot_description: 群發描述',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: false
  })
  @IsNumber()
  @IsOptional()
  perPage: number;
}

export class LogList {
  event: string;
  eventName: string;
  sendDate: string;
  sendMethod: string[];
  expectedCount: number[];
  realCount: number[];
  openCount: number[];
  sendTime: string;
  createDate: string;
  createName: string;
  alterDate: string;
  alterName: string;
}

export class GetSendLogResp {
  @ApiProperty({ type: [LogList] })
  logList: LogList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
