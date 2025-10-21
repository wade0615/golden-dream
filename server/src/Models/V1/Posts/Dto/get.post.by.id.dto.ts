import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPostByIdReq {
  @ApiProperty({
    title: '文章 id',
    example: 'test_post_id_001',
    description: '文章 id',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  postId: string;
}

export class GetPostByIdResp {
  @ApiProperty({
    title: '標題',
    example: '測試文章2',
    description: '標題'
  })
  @IsString()
  title: string;

  @ApiProperty({
    title: '分類',
    example: '測試分類',
    description: '分類'
  })
  @IsString()
  category: string;

  @ApiProperty({
    title: '分類ID',
    example: '測試分類ID',
    description: '分類'
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    title: '簡介',
    example: '這是一篇測試文章',
    description: '簡介'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    title: '日期',
    example: '2021-10-01',
    description: '日期'
  })
  @IsString()
  createdDate: string;

  @ApiProperty({
    title: '前一篇文章 id',
    example: 'post_id_005'
  })
  @IsString()
  prevPostId: string;

  @ApiProperty({
    title: '後一篇文章 id',
    example: 'post_id_007'
  })
  @IsString()
  nextPostId: string;
}
