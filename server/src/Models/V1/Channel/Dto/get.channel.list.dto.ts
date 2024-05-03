import { ApiProperty } from '@nestjs/swagger';

export class BrandDetail {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號',
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '旭集',
    description: '品牌名稱',
  })
  brandName: string;
}

export class GetChannelListResp {
  @ApiProperty({
    title: '渠道編號',
    example: 'Ch0000',
    description: '渠道編號',
  })
  channelId: string;

  @ApiProperty({
    title: '渠道名稱',
    example: 'CRM後台',
    description: '渠道名稱',
  })
  channelName: string;

  @ApiProperty({
    title: '會籍/積點計算訂單',
    example: 'true',
    description: '會籍/積點計算訂單',
  })
  pointCalculation: boolean;

  @ApiProperty({
    type: [BrandDetail],
    title: '品牌資料',
    description: '有開放的品牌資料',
  })
  brandDetail: BrandDetail[];
}
