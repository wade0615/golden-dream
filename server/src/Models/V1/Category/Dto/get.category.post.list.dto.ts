import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

import { PostList } from 'src/Models/V1/Posts/Dto/get.post.list.dto';

export class GetCategoryPostListReq {
  @ApiProperty({
    title: '分類 id',
    example: '20241001_test2',
    description: '分類 id',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    title: '頁數',
    example: '1',
    description: '頁數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '每頁筆數',
    example: '20',
    description: '每頁筆數',
    required: true
  })
  @IsNotEmpty()
  perPage: number;
}

export class GetCategoryPostListResp {
  @ApiProperty({ type: [PostList] })
  postList: PostList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
