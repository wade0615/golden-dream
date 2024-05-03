import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetMotClusterListDto {
  @ApiProperty({
    title: '群發狀態',
    example: 'pending',
    description: 'pending：待執行/end：已結束/draft：草稿/執行中：ing',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  clusterStatus: string;

  @ApiProperty({
    title: '群發類型',
    example: 'single',
    description: 'regular：定期/single：單次',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    title: '群發ID、群發名稱、描述關鍵字',
    example: 'MOCL231201002',
    description: '群發ID、群發名稱、描述關鍵字',
    required: false
  })
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

export class ClusterList {
  @ApiProperty({
    title: '群發編號',
    example: 'R230823002'
  })
  clusterId: string;

  @ApiProperty({
    title: '群發名稱',
    example: '名稱'
  })
  clusterName: string;

  @ApiProperty({
    title: '發送方式',
    example: '[APP推播,簡訊]'
  })
  sendMethod: string[];

  @ApiProperty({
    title: '人數',
    example: '[1,3,4]'
  })
  peopleCount: number[];

  @ApiProperty({
    title: '發送時間',
    example: ['2023/12/29', '指定日期-09:00發送']
  })
  sendTime: string[];

  @ApiProperty({
    title: '建立時間',
    example: '2023-06-26T15:03:38.000Z'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'system'
  })
  createName: string;

  @ApiProperty({
    title: '修改時間',
    example: '2023-06-26T15:03:38.000Z',
    description: '修改時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '修改人員',
    example: 'system'
  })
  alterName: string;
}

export class GetMotClusterListResp {
  @ApiProperty({ type: [ClusterList] })
  clusterList: ClusterList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
