import { ApiProperty } from '@nestjs/swagger';

export class GetTagGroupListResp {
  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號'
  })
  tagGroupId: string;

  @ApiProperty({
    title: '標籤分類名稱',
    example: '群組一號',
    description: '標籤分類名稱'
  })
  tagGroupName: string;

  @ApiProperty({
    title: '標籤數',
    example: '12',
    description: '標籤數'
  })
  tagGroupCount: number;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '標籤分類建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '標籤分類建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023/06/19 17:27:37',
    description: '標籤分類更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '標籤分類更新資料的角色'
  })
  alterName: string;
}
