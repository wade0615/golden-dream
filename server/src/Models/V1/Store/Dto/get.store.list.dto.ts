import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetStoreListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '0912345678',
    description: '品牌/門市/商場',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'brand_name',
    description:
      'brand_name: 品牌名稱/store_name: 門市名稱/mall_name: 商場名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '門市狀態',
    example: 'true',
    description: '門市狀態，0: 全部; 1: 啟用; 2: 不啟用',
    required: false
  })
  @IsNumber()
  @IsOptional()
  state: number;

  @ApiProperty({
    title: '縣市代碼',
    example: '100',
    description: '縣市代碼',
    required: false
  })
  @IsOptional()
  cityCode: number;

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
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號'
  })
  brandId: string;

  @ApiProperty({
    title: '門市編號',
    example: 'S2212290071',
    description: '門市編號'
  })
  storeId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '旭集',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '門市名稱',
    example: '微風信義店',
    description: '門市名稱'
  })
  storeName: string;

  @ApiProperty({
    title: '城市代碼',
    example: '400',
    description: '縣市代碼'
  })
  cityCode: string;

  @ApiProperty({
    title: '區域代碼',
    example: '12',
    description: '區域代碼'
  })
  zipCode: string;

  @ApiProperty({
    title: '門市狀態',
    example: 'true',
    description: '門市狀態，true: 啟用 false: 不啟用'
  })
  state: boolean;

  @ApiProperty({
    title: '商場名稱',
    example: '商場名稱',
    description: '商場名稱'
  })
  mallName: string;

  @ApiProperty({
    title: 'POS商店代碼',
    example: 'KH001',
    description: 'POS機的代碼'
  })
  posCode: string;

  @ApiProperty({
    title: '門市人數',
    example: '15',
    description: '門市人數'
  })
  peopleCount: number;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '門市建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '門市建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023/06/19 17:27:37',
    description: '門市更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '更新資料的角色'
  })
  alterName: string;
}

export class GetStoreListResp {
  @ApiProperty({ type: StoreList })
  storeList: StoreList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
