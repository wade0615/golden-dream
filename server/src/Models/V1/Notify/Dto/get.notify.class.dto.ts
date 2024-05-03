import { ApiProperty } from '@nestjs/swagger';

export class GetNotifyClassListResp {
  @ApiProperty({
    title: '通知分類流水號',
    example: '1',
    description: '依照通知分類表設定'
  })
  seq: number;

  @ApiProperty({
    title: '通知分類名稱',
    example: '分類01',
    description: '依照通知分類表設定'
  })
  groupName: string;

  @ApiProperty({
    title: '通知人員數量',
    example: '2',
    description: '依照通知人員與分類 MAP 表總和'
  })
  userCount: number;

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-18T10:10:41.000Z',
    description: '依照通知分類表創建時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '品牌建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-18T10:10:41.000Z',
    description: '依照通知分類表更新時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '品牌更新資料的角色'
  })
  alterName: string;
}
