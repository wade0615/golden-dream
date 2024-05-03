import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTagDetailDto {
  @ApiProperty({
    title: '標籤編號',
    example: '1',
    description: '標籤編號',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  tagId: number;
}

export class GetTagDetailResp {
  @ApiProperty({
    title: '標籤編號',
    example: '1',
    description: '標籤編號'
  })
  tagId: number;

  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號'
  })
  tagGroupId: number;

  @ApiProperty({
    title: '標籤名稱',
    example: '名稱1',
    description: '標籤名稱'
  })
  tagName: string;

  @ApiProperty({
    title: '標籤啟用時間狀態',
    example: 'PERMANENT',
    description: 'PERMANENT：永久; RANGE：時間區間'
  })
  tagActiveType: string;

  @ApiProperty({
    title: '標籤狀態',
    example: '0',
    description: '0：停用; 1：啟用'
  })
  state: number;

  @ApiProperty({
    title: '標籤狀態',
    example: '0',
    description: '0：停用; 1：啟用'
  })
  endDate: string;

  @ApiProperty({
    title: '標籤描述',
    example: '描述1',
    description: '標籤的描述'
  })
  description: string;

  @ApiProperty({
    title: '貼標人數',
    example: '1',
    description: '用於判斷是否顯示刪除按鈕'
  })
  tagCount: number;
}
