import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetClusterDownloadListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '1',
    description: 'ID/分群名稱/分群描述',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'cluster_id',
    description:
      'cluster_id: 分群ID/cluster_name: 分群名稱/cluster_description: 分群描述',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '類型',
    example: '1',
    description: '單次：single; 定期：regular',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

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

export class ClusterDownloadList {
  @ApiProperty({
    title: '匯出編號',
    example: 'EX2311280017',
    description: '匯出編號'
  })
  exportId: string;

  @ApiProperty({
    title: '分群編號',
    example: 'C000000001',
    description: '分群編號'
  })
  clusterId: string;

  @ApiProperty({
    title: '分群條件名稱',
    example: '',
    description: '分群條件名稱'
  })
  clusterName: string;

  @ApiProperty({
    title: '人數',
    example: '',
    description: '根據分群條件，實際產出的人數'
  })
  peopleCount: number;

  @ApiProperty({
    title: 'csv URL',
    example: '',
    description: '上傳 csv 至 GCS URL'
  })
  csvUrl: string;

  @ApiProperty({
    title: '匯出時間',
    example: '',
    description: '匯出CSV的時間'
  })
  exportDate: string;

  @ApiProperty({
    title: '匯出人員',
    example: '',
    description: '匯出CSV的人員'
  })
  exportName: string;

  @ApiProperty({
    title: '建立時間',
    example: '',
    description: '分群資料條件建立時間'
  })
  createDate: string;

  @ApiProperty({
    title: '建立人員',
    example: '',
    description: '分群資料條件建立人員'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '',
    description: '分群資料條件更新時間'
  })
  alterDate: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '分群資料條件更新人員'
  })
  alterName: string;
}

export class GetClusterDownloadListResp {
  @ApiProperty({ type: [ClusterDownloadList] })
  clusterDownloadList: ClusterDownloadList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
