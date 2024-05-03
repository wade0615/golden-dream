import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetClusterSettingListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '集點卡1',
    description: '關鍵字搜尋欄，集點卡名稱',
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
    title: '集點卡狀態',
    example: 'END',
    description: 'ING: 執行中; END: 已結束; PENDING: 待執行',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    title: '分群類型',
    example: 'single',
    description: 'single: 單次分群; regular: 定期分群',
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

export class ClusterSettingList {
  @ApiProperty({
    title: '分群編號',
    example: 'C000000001',
    description: '分群編號'
  })
  clusterId: string;

  @ApiProperty({
    title: '分群名稱',
    example: '分群名稱0001',
    description: '分群名稱'
  })
  clusterName: string;

  @ApiProperty({
    title: '人數',
    example: '10000',
    description: '人數'
  })
  peopleCount: number;

  @ApiProperty({
    title: '匯出狀態',
    example: 'immediate',
    description:
      'immediate：即時; specifiedDate：指定日期; everyHalfMonth：每半月; everyMonth：每個月; everyQuarter：每一季; specifiedRangeDate：指定範圍日期'
  })
  exportStatus: string;

  @ApiProperty({
    title: '匯出起始時間',
    example: '2023/06/19 17:27:37',
    description: '匯出起始時間'
  })
  exportStartDate: string;

  @ApiProperty({
    title: '匯出結束時間',
    example: '2023/06/19 17:27:37',
    description: '匯出結束時間'
  })
  exportEndDate: string;

  @ApiProperty({
    title: '每滿 N 個月',
    example: '1',
    description: '每滿 N 個月，指定範圍日期'
  })
  monthEvery: number;

  @ApiProperty({
    title: '下月1日匯出',
    example: 'RANGE',
    description: '下月1日匯出，區間資料: RANGE; 指定範圍日期: ASSIGN'
  })
  dataType: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '分群設定建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '分群設定建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023/06/19 17:27:37',
    description: '分群設定更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '分群設定更新資料的角色'
  })
  alterName: string;
}

export class GetClusterSettingListResp {
  @ApiProperty({ type: [ClusterSettingList] })
  clusterSettingList: ClusterSettingList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
