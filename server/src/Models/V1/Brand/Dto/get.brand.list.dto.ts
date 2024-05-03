import { ApiProperty } from '@nestjs/swagger';

export class GetBrandListResp {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號'
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '旭集',
    description: '品牌名稱'
  })
  name: string;

  @ApiProperty({
    title: '事業群名稱',
    example: '旭',
    description: '事業群'
  })
  businessGroup: string;

  @ApiProperty({
    title: '門市數量',
    example: '1',
    description: '品牌下的總門市數量'
  })
  storeCount: number;

  @ApiProperty({
    title: '渠道數量',
    example: '1',
    description: '品牌下的有連接的渠道數量'
  })
  channelCount: number;

  @ApiProperty({
    title: '狀態',
    example: 'true',
    description: '品牌狀態，true: 啟用 false: 不啟用'
  })
  state: boolean;

  @ApiProperty({
    title: '是否為集團店',
    example: 'true',
    description: '集團店狀態，true: 是 false: 否'
  })
  isCorporation: boolean;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '品牌建立的時間'
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
    example: '2023/06/19 17:27:37',
    description: '品牌更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '品牌更新資料的角色'
  })
  alterName: string;
}
