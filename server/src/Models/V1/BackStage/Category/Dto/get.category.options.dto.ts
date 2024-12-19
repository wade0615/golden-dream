import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetCategoryOptionsResp {
  @ApiProperty({
    title: '分類 ID',
    example: 'C24120301',
    description: '分類 ID'
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    title: '分類名稱',
    example: '我是一個測試分類',
    description: '分類名稱'
  })
  @IsString()
  categoryName: string;
}
