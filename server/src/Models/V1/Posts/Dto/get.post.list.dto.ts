import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetPostListReq {
  @ApiProperty({
    title: '頁數',
    example: '1',
    description: '頁數',
    required: false
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '每頁筆數',
    example: '20',
    description: '每頁筆數',
    required: false
  })
  @IsNotEmpty()
  perPage: number;
}

export class PostList {
  @ApiProperty({
    title: '文章 id',
    example: '20241001_test2',
    description: '文章 id'
  })
  @IsString()
  id: string;

  @ApiProperty({
    title: '標題',
    example: '測試文章2',
    description: '標題'
  })
  @IsString()
  title: string;

  @ApiProperty({
    title: '日期',
    example: '2021-10-01',
    description: '日期'
  })
  @IsString()
  date: string;

  @ApiProperty({
    title: '分類',
    example: '測試分類',
    description: '分類'
  })
  @IsString()
  category: string;

  @ApiProperty({
    title: '標籤',
    example: '測試標籤',
    description: '標籤'
  })
  @IsString()
  tag: string;

  @ApiProperty({
    title: '簡介',
    example: '這是一篇測試文章',
    description: '簡介'
  })
  @IsString()
  content: string;
}

export class GetPostListResp {
  @ApiProperty({ type: [PostList] })
  postList: PostList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
