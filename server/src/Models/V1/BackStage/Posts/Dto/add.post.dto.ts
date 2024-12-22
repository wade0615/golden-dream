import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddPostReq {
  @ApiProperty({
    title: '文章標題',
    example: '我是一則文章標題',
    description: '文章標題',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  postName: string;

  @ApiProperty({
    title: '文章內容',
    example: '我在講一個故事',
    description: '文章內容',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    title: '文章短敘述',
    example: '故事簡介',
    description: '文章短敘述',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  shortContent: string;

  @ApiProperty({
    title: '文章分類',
    example: 'C24101801',
    description: '文章分類',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    title: '文章類型',
    example: '2',
    description: '1: 特殊文章, 2: 一般文章',
    required: true
  })
  @IsString()
  @IsOptional()
  postType: string;

  @ApiProperty({
    title: '文章是否發布',
    example: '0',
    description: '1: 發布, 0: 未發布',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  isPublish: string;
}
