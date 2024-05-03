import { ApiProperty } from '@nestjs/swagger';

export class RewardCardMenu {
  @ApiProperty({
    title: '集點卡 ID',
    example: 'RC2308150001',
    description: '集點卡編號'
  })
  rewardCardId: string;

  @ApiProperty({
    title: '集點卡名稱',
    default: '集點卡1',
    description: '集點卡名稱'
  })
  rewardCardName: string;

  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '品牌代碼'
  })
  brandId: string;

  @ApiProperty({
    title: '下架時間',
    example: '',
    description: '下架時間'
  })
  endDate: string;
}

export class GetRewardCardMenuResp {
  @ApiProperty({ type: RewardCardMenu })
  rewardCardMenu: RewardCardMenu[];
}
