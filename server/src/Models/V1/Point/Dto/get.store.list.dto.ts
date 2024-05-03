import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetStoreListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '台北101店',
    description: '門市名稱/代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'store_name',
    description: 'store_name: 門市名稱/store_id: 代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '品牌',
    example: 'CD',
    description: '品牌',
    required: false
  })
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({
    title: '商場',
    example: '101商場',
    description: '商場',
    required: false
  })
  @IsString()
  @IsOptional()
  mall: string;

  @ApiProperty({
    title: '縣市',
    example: '70001',
    description: '縣市',
    required: false
  })
  @IsString()
  @IsOptional()
  cityCode: string;

  @ApiProperty({
    title: '區域',
    example: '100',
    description: '區域',
    required: false
  })
  @IsString()
  @IsOptional()
  zipCode: string;

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

export class StoreList {
  @ApiProperty({
    title: '品牌名稱',
    example: '旭集'
  })
  brandName: string;

  @ApiProperty({
    title: '門市名稱',
    example: '微風信義店'
  })
  storeName: string;

  @ApiProperty({
    title: '縣市',
    example: '台北市'
  })
  city: string;

  @ApiProperty({
    title: '區域',
    example: '大安區'
  })
  zip: string;

  @ApiProperty({
    title: '商場',
    example: '101'
  })
  mallName: string;

  @ApiProperty({
    title: '門市代碼',
    example: 'AA'
  })
  posStore: string;
}

export class GetStoreListResp {
  @ApiProperty({ type: [StoreList] })
  storeList: StoreList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
