import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetMemberPointLogDto {
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
    title: '來源項目',
    example: 'basic',
    description: '來源項目',
    required: false
  })
  @IsString()
  @IsOptional()
  pointType: string;

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
    title: '項目',
    example: '消費積點回饋'
  })
  pointItem: string;

  @ApiProperty({
    title: '積點',
    example: 100
  })
  point: string;

  @ApiProperty({
    title: '交易序號',
    example: 'G4444'
  })
  orderId: string;

  @ApiProperty({
    title: '積點效期',
    example: '2023-09-02'
  })
  expiredDate: string;

  @ApiProperty({
    title: '發放/異動時間',
    example: '2023-09-02'
  })
  sendOrDeductDate: string;

  @ApiProperty({
    title: '品牌',
    example: '續集'
  })
  brandName: string;

  @ApiProperty({
    title: '門市',
    example: '新莊'
  })
  storeName: string;
}

export class BillInfo {
  @ApiProperty({
    title: 'wording',
    example: '年度已使用積點'
  })
  text: string;

  @ApiProperty({
    title: '數字',
    example: 20
  })
  number: number;
}

export class GetMemberPointLogResp {
  @ApiProperty({ type: [LogList] })
  logList: LogList[];

  @ApiProperty({ type: BillInfo })
  billInfo: BillInfo[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
