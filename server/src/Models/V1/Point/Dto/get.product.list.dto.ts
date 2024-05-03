import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetProductListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '台北101店',
    description: '商品名稱/代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'product_id',
    description: 'product_id: 商品代碼; product_name: 商品名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '訂單來源',
    example: '[channel01,channel02]',
    description: '訂單來源',
    required: false
  })
  @IsArray()
  @IsOptional()
  channel: string[];

  @ApiProperty({
    title: '商品品牌',
    example: '品牌',
    description: '商品品牌',
    required: false
  })
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({
    title: '排除的商品',
    example: '[prd01,prd02]',
    description: '排除的商品',
    required: false
  })
  @IsArray()
  @IsOptional()
  excludePrdIds: string[];

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

export class ProductList {
  @ApiProperty({
    title: '商品編號',
    example: 'A0001'
  })
  productId: string;

  @ApiProperty({
    title: '商品',
    example: '巧克力'
  })
  productName: string;

  @ApiProperty({
    title: '品牌',
    example: '巧克比'
  })
  brandName: string;

  @ApiProperty({
    title: '商品來源',
    example: '大安區'
  })
  channelName: string;
}

export class GetProductListResp {
  @ApiProperty({ type: [ProductList] })
  productList: ProductList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
