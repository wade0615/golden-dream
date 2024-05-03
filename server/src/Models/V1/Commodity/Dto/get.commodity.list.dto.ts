import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetCommodityListDto {
  @ApiProperty({
    title: '商品名稱',
    example: '商品001',
    description: '商品名稱-模糊搜尋',
    required: false
  })
  @IsString()
  @IsOptional()
  commodityName: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'commodity_name',
    description: 'commodity_name: 商品名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '渠道編號',
    example: 'Ch0000',
    description: '渠道編號',
    required: false
  })
  @IsString()
  @IsOptional()
  channelId: string;

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
    title: '商品狀態',
    example: 'SALE',
    description: '商品狀態，SALE: 銷售中; STOP_SELL:  停售',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    title: '商品類型',
    example: '0',
    description: '0:全部; 1:單品; 2:套餐',
    required: false
  })
  @IsNumber()
  @IsOptional()
  commodityType: number;

  @ApiProperty({
    title: '套餐子項',
    example: '0',
    description: '0:不限; 1:是; 2:否',
    required: false
  })
  @IsNumber()
  @IsOptional()
  comboSub: number;

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

export class CommodityList {
  @ApiProperty({
    title: '渠道名稱',
    example: 'CRM後台',
    description: '渠道名稱'
  })
  channelName: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '旭集',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '商品類型',
    example: '1',
    description: '商品類型，1:單品; 2:套餐'
  })
  productType: number;

  @ApiProperty({
    title: '套餐子項',
    example: 'true',
    description: '是否為套餐子項'
  })
  isComboSub: boolean;

  @ApiProperty({
    title: '商品編號',
    example: '1',
    description: '商品編號'
  })
  productId: string;

  @ApiProperty({
    title: '商品名稱',
    example: '商品001',
    description: '商品名稱'
  })
  productName: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-13T07:16:14.000Z',
    description: '建立時間'
  })
  createTime: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-13T07:16:14.000Z',
    description: '更新時間'
  })
  alterTime: string;
}

export class GetCommodityListResp {
  @ApiProperty({ type: [CommodityList] })
  commodityList: CommodityList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
