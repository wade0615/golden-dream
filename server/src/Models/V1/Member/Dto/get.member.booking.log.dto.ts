import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetMemberBookingLogDto {
  @ApiProperty({
    title: '會員編號',
    example: 'M00000001',
    description: '長度為10的會員編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    title: '品牌',
    example: '',
    description: '品牌編號',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '開始日',
    example: '2023/02/02 00:00:00',
    description: '開始日',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '結束日',
    example: '2023/02/02 23:59:59',
    description: '結束日',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

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
  @ApiProperty({
    title: '品牌名稱',
    example: '續集'
  })
  brandName: string;

  @ApiProperty({
    title: '門市名稱',
    example: '中正店'
  })
  storeName: string;

  @ApiProperty({
    title: '訂位人數',
    example: 3
  })
  peopleCount: number;

  @ApiProperty({
    title: '訂位時間',
    example: '2023/09/02 12:00'
  })
  bookingDate: string;

  @ApiProperty({
    title: '是否報到',
    example: true
  })
  isCheckIn: boolean;

  @ApiProperty({
    title: '訂位編號',
    example: 'ST202305151120'
  })
  bookingId: string;
}

export class BillInfo {
  @ApiProperty({
    title: 'wording',
    example: '訂位次數'
  })
  text: string;

  @ApiProperty({
    title: '數字',
    example: '20'
  })
  number: string;
}

export class GetMemberBookingLogResp {
  @ApiProperty({ type: [LogList] })
  logList: LogList[];

  @ApiProperty({ type: BillInfo })
  billInfo: BillInfo[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
