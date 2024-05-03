import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetTagListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '標籤',
    description: '標籤名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'tag_name',
    description: 'tag_name: 標籤名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '標籤狀態',
    example: 'ENABLE',
    description: 'ENABLE：啟用; DISABLE：停用',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號',
    required: false
  })
  @IsNumber()
  @IsOptional()
  tagGroupId: number;

  @ApiProperty({
    title: '啟用時間',
    example: 'RANGE',
    description: 'PERMANENT：永久; RANGE：時間區間',
    required: false
  })
  @IsString()
  @IsOptional()
  dateState: string;

  @ApiProperty({
    title: '啟用時間，起始時間',
    example: '2023/01/01',
    description: '啟用時間，起始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty({
    title: '啟用時間，結束時間',
    example: '2023/01/01',
    description: '啟用時間，結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  endDate: string;

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

export class TagList {
  @ApiProperty({
    title: '標籤編號',
    example: '1',
    description: '標籤編號'
  })
  tagId: string;

  @ApiProperty({
    title: '標籤名稱',
    example: '1',
    description: '標籤名稱'
  })
  tagName: string;

  @ApiProperty({
    title: '標籤分類名稱',
    example: '1',
    description: '標籤分類名稱'
  })
  tagGroupName: string;

  @ApiProperty({
    title: '啟用時間，起始日',
    example: '2023-01-01',
    description: '啟用時間，起始日'
  })
  startDate: string;

  @ApiProperty({
    title: '啟用時間，結束日',
    example: '2023-01-01',
    description: '啟用時間，結束日'
  })
  endDate: string;

  @ApiProperty({
    title: '貼標人數',
    example: '21',
    description: '貼標人數'
  })
  tagMemberCount: number;

  @ApiProperty({
    title: '啟用時間',
    example: 'RANGE',
    description: 'PERMANENT：永久; RANGE：時間區間'
  })
  dateState: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '標籤分類建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '標籤分類建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023/06/19 17:27:37',
    description: '標籤分類更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '標籤分類更新資料的角色'
  })
  alterName: string;
}

export class GetTagListResp {
  @ApiProperty({ type: [TagList] })
  tagList: TagList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
