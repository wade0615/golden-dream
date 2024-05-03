import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class GetPointLogDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '關鍵字搜尋',
    example: '09565656',
    description: '手機號碼/卡號/交易序號',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'mobile: 手機/member_card: 卡號/transaction_id: 交易序號',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '來源項目',
    example: 'basic',
    description: 'basic/cons/birthday',
    required: false
  })
  @IsString()
  @IsOptional()
  pointType: string;

  @ApiProperty({
    title: '品牌',
    example: 'CX',
    description: '品牌',
    required: false
  })
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({
    title: '發放時間開始',
    example: '2023/06/19',
    description: '發放時間開始',
    required: false
  })
  @IsString()
  @IsOptional()
  sendStartDate: string;

  @ApiProperty({
    title: '發放時間結束',
    example: '2023/06/19',
    description: '發放時間結束',
    required: false
  })
  @IsString()
  @IsOptional()
  sendEndDate: string;

  @ApiProperty({
    title: '異動時間開始',
    example: '2023/06/19',
    description: '異動時間開始',
    required: false
  })
  @IsString()
  @IsOptional()
  deductStartDate: string;

  @ApiProperty({
    title: '異動時間結束',
    example: '2023/06/19',
    description: '異動時間結束',
    required: false
  })
  @IsString()
  @IsOptional()
  deductEndDate: string;

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
    title: '卡號',
    example: 'i646515'
  })
  cardId: string;

  @ApiProperty({
    title: '會員姓名',
    example: 'Ming Wang'
  })
  name: string;

  @ApiProperty({
    title: '訂單來源',
    example: 'Pos'
  })
  orderType: string;

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
    title: '發放時間',
    example: '2023-09-02'
  })
  sendDate: string;

  @ApiProperty({
    title: '異動時間',
    example: '2023-09-02'
  })
  deductDate: string;

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

  mobileCountryCode?: string;
  mobile?: string;
}

export class GetPointLogResp {
  @ApiProperty({ type: [LogList] })
  logList: LogList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
