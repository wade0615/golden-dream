import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetPointSendingListDto {
  @ApiProperty({
    title: '活動名稱',
    example: '雙十一加倍送',
    description: '活動名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardName: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'reward_name',
    description: 'reward_name: 活動名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '活動類型',
    example: 'Reward/Cons',
    description: '活動類型，活動型:Reward/消費型:Cons',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardType: string;

  @ApiProperty({
    title: '開始日期',
    example: '2023/06/19 12:00:00',
    description: '開始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty({
    title: '結束日期',
    example: '2023/06/19 13:00:00',
    description: '結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    title: '會籍類型',
    example: '1',
    description: '根據會籍管理設定資料',
    required: false
  })
  @IsString()
  @IsOptional()
  membershipStatus: string;

  @ApiProperty({
    title: '活動狀態',
    example: 'ing/notYet/end',
    description: '活動狀態',
    required: false
  })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '排除的積點活動 ID',
    examples: ['R231018008', 'R231018009'],
    description: '欲排除的積點活動 ID',
    required: false
  })
  @IsArray()
  @IsOptional()
  excludePointRewardIds: string[];

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: false
  })
  @IsNumber()
  @IsOptional()
  perPage: number;
}

export class SendingList {
  @ApiProperty({
    title: '活動編號',
    example: 'R230823002'
  })
  rewardId: string;

  @ApiProperty({
    title: '活動名稱',
    example: '活動型積點'
  })
  rewardName: string;

  @ApiProperty({
    title: '會籍',
    example: '[星卡]'
  })
  memberShipName: string[];

  @ApiProperty({
    title: '類型',
    example: '消費型'
  })
  rewardType: string;

  @ApiProperty({
    title: '類型',
    example: '消費型'
  })
  rewardTypeStr: string;

  @ApiProperty({
    title: '回饋積點',
    example: '[500點]'
  })
  rewardPoints: string[];

  @ApiProperty({
    title: '活動狀態',
    example: 'ing/notYrt/end'
  })
  rewardStatus: string;

  @ApiProperty({
    title: '活動開始日',
    example: '2023-09-02',
    description: ''
  })
  startDate: string;

  @ApiProperty({
    title: '活動結束日',
    example: '2023-09-02',
    description: ''
  })
  endDate: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023-06-26T15:03:38.000Z'
  })
  createDate: string;

  @ApiProperty({
    title: '建立人員',
    example: 'system'
  })
  createId: string;

  @ApiProperty({
    title: '修改時間',
    example: '2023-06-26T15:03:38.000Z',
    description: '更新會員的時間'
  })
  modifyDate: string;

  @ApiProperty({
    title: '修改人員',
    example: 'system'
  })
  modifyId: string;
}

export class GetPointSendingListResp {
  @ApiProperty({ type: [SendingList] })
  sendingList: SendingList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
