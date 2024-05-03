import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetMemberEcVoucherLogDto {
  @ApiProperty({
    title: '會員編號',
    example: 'M00000001',
    description: '長度為10的會員編號',
    required: false
  })
  @IsString()
  @IsOptional()
  memberId: string;

  @ApiProperty({
    title: '手機/卡號/交易序號',
    example: '4445',
    description: '手機/卡號/交易序號',
    required: false
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'mobile: 手機/member_card: 卡號/transaction_id: 交易序號',
    required: false
  })
  @IsOptional()
  @IsString()
  searchType: string;

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
    title: '狀態',
    example: 'isExpired',
    description:
      'canUse:可使用、isWriteOff:已核銷、isExpired:已到期、isTransfer:已轉贈、isReturn:已退貨',
    required: false
  })
  @IsString()
  @IsOptional()
  state: string;

  @ApiPropertyOptional({
    title: '開始日',
    example: '2023/02/02 00:00:00',
    description: '開始日',
    required: false
  })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiPropertyOptional({
    title: '結束日',
    example: '2023/02/02 23:59:59',
    description: '結束日',
    required: false
  })
  @IsString()
  @IsOptional()
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
    title: '流水號',
    example: 0
  })
  id: number;

  @ApiProperty({
    title: '卡號',
    example: 'i65266'
  })
  cardId: string;

  @ApiProperty({
    title: '會員姓名',
    example: '王小明'
  })
  name: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '續集'
  })
  brandName: string;

  @ApiProperty({
    title: '票券名稱',
    example: '折10%券'
  })
  voucherName: string;

  @ApiProperty({
    title: '交易金額',
    example: '$5,000'
  })
  amount: string;

  @ApiProperty({
    title: '交易日',
    example: '2023/09/02 12:00'
  })
  tradeDate: string;

  @ApiProperty({
    title: '到期日',
    example: '2023/09/02 12:00'
  })
  expireDate: string;

  @ApiProperty({
    title: '交易序號',
    example: 'ST202305151120'
  })
  tradeNo: string;

  @ApiProperty({
    title: '可使用數量',
    example: '5'
  })
  canUseCount: string;

  @ApiProperty({
    title: '已核銷數量',
    example: '5'
  })
  writeOffCount: string;

  @ApiProperty({
    title: '已到期數量',
    example: '5'
  })
  expiredCount: string;

  @ApiProperty({
    title: '已轉贈數量',
    example: '5'
  })
  transferCount: string;

  @ApiProperty({
    title: '已退貨數量',
    example: '5'
  })
  returnCount: string;
}

export class BillInfo {
  @ApiProperty({
    title: 'wording',
    example: '可使用'
  })
  text: string;

  @ApiProperty({
    title: '數字',
    example: '20'
  })
  number: string;
}

export class GetMemberEcVoucherLogResp {
  @ApiProperty({ type: [LogList] })
  logList: LogList[];

  @ApiProperty({ type: BillInfo })
  billInfo: BillInfo[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
