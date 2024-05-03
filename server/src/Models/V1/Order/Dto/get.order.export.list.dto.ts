import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetOrderExportListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: 'ABCABC1234567',
    description: '匯出編號',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'export_id',
    description: 'export_id: 匯出ID',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '搜尋欄',
    example: 'ABCABC1234567',
    description:
      'memberInfo: 會員資料; memberTag: 會員標籤管理; orderDetail: 消費紀錄; commodityDetail: 商品券明細; rewardDetail: 集點卡明細; couponDetail: 優惠券明細',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  action: string;

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

export class OrderExportList {
  @ApiProperty({
    title: '匯出編號',
    example: '1',
    description: '匯出編號'
  })
  exportId: string;

  @ApiProperty({
    title: '匯出檔案名稱',
    example: '項目名稱',
    description: '匯出檔案名稱'
  })
  exportName: string;

  @ApiProperty({
    title: '匯出檔案 URL',
    example: 'https://localhost',
    description: '匯出檔案 URL'
  })
  exportUrl: string;

  @ApiProperty({
    title: '匯出時間',
    example: 'YYYY/MM/DD HH:MM',
    description: '匯出時間'
  })
  exportDate: string;

  @ApiProperty({
    title: '建立時間',
    example: 'YYYY/MM/DD HH:MM',
    description: '建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '建立的角色'
  })
  createName: string;
}

export class GetOrderExportListResp {
  @ApiProperty({ type: [OrderExportList] })
  memberExportList: OrderExportList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
