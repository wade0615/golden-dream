import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
    title: '文章 id',
    example: 'test_post_id_001',
    description: '文章 id',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    title: '文章 id',
    example: 'test_post_id_001',
    description: '文章 id',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  shortContent: string;

  @ApiProperty({
    title: '文章 id',
    example: 'test_post_id_001',
    description: '文章 id',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  postType: number;

  @ApiProperty({
    title: '文章 id',
    example: 'test_post_id_001',
    description: '文章 id',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  isPublish: number;
}
