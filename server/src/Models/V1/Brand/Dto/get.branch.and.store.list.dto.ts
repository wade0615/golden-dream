import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetBrandAndStoreListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '0912345678',
    description: 'POS商店代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'pos_store',
    description: 'pos_store: POS商店代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '品牌編號(複數)',
    examples: ['TT'],
    description: '品牌編號(複數)',
    required: false
  })
  @IsArray()
  @IsOptional()
  brandIds: string[];

  @ApiProperty({
    title: '商場名稱',
    example: '001商場',
    description: '商場名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  mallName: string;

  @ApiProperty({
    title: '縣市代碼',
    example: '70001',
    description: '縣市代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  cityCode: string;

  @ApiProperty({
    title: '區域代碼',
    example: '100',
    description: '區域代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty({
    title: '排除的門市 ID',
    examples: ['S2212290073', 'S2212290074'],
    description: '欲排除的門市 ID',
    required: false
  })
  @IsArray()
  @IsOptional()
  excludeStoreIds: string[];

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

export class BrandAndStoreList {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號'
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    default: '旭集',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '門市名稱',
    default: '台北101店',
    description: '門市名稱'
  })
  storeName: string;

  @ApiProperty({
    title: '縣市代碼',
    default: '70001',
    description: '縣市代碼'
  })
  cityCode: string;

  @ApiProperty({
    title: '區域代碼',
    default: '100',
    description: '區域代碼'
  })
  zipCode: string;

  @ApiProperty({
    title: '商場名稱',
    default: '101商場',
    description: '商場名稱'
  })
  mallName: string;

  @ApiProperty({
    title: '門市編號',
    example: 'S2212290072',
    description: '門市編號'
  })
  storeId: string;

  @ApiProperty({
    title: 'POS 商店代碼',
    default: 'KH011',
    description: 'POS 商店代碼'
  })
  posStore: string;
}

export class GetBrandAndStoreListResp {
  @ApiProperty({ type: [BrandAndStoreList] })
  brandAndStoreList: BrandAndStoreList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
