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
    title: '簡介',
    example: '這是一篇測試文章',
    description: '簡介'
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
