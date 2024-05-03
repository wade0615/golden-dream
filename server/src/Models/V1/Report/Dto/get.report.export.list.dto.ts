import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetReportExportListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '2023',
    description: '關鍵字搜尋欄，年份',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'data_year',
    description: 'data_year: 年份',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '報表類型',
    example: 'memberConsumptionAnalysis',
    description:
      'memberConsumptionAnalysis：會員消費分析; corporationAmount：集團營業額; amountComposition：營業額組成; pointStatistics：點數統計; couponAnalysis：優惠券分析; memberInfoAnalysis：會員輪廓分析',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

export class ReportExportList {
  @ApiProperty({
    title: '匯出編號',
    example: 'EX00001',
    description: '匯出編號'
  })
  exportId: string;

  @ApiProperty({
    title: '檔案名稱',
    default: '20230106_會員消費分析.xlsx',
    description: '檔案名稱'
  })
  fileName: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '報表建立的時間'
  })
  createTime: string;
}

export class GetReportExportListResp {
  @ApiProperty({ type: [ReportExportList] })
  reportExportList: ReportExportList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
