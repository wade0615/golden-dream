import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetRewardCardSettingListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '集點卡1',
    description: '關鍵字搜尋欄，集點卡名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'reward_name',
    description: 'reward_name: 集點卡名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '集點卡狀態',
    example: 'ING',
    description: 'ING: 進行中; END: 已結束; NOT_START:  尚未開始',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '依照品牌代碼設定',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '發佈狀態',
    example: '0',
    description: '0: 全部; 1: 已發佈; 2: 未發佈',
    required: false
  })
  @IsNumber()
  @IsOptional()
  releaseState: number;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

export class RewardCardSettingList {
  @ApiProperty({
    title: '集點卡 ID',
    default: 'RC2308150001',
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
    title: '品牌名稱',
    default: '旭集',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '縮圖',
    example: 'https://localhost/',
    description: '圖片URL'
  })
  thumbnailImage: string;

  @ApiProperty({
    title: '發佈狀態',
    example: '1',
    description: '1: 已發佈; 2: 未發佈'
  })
  releaseStatus: boolean;

  @ApiProperty({
    title: '上架時間',
    example: '',
    description: '上架時間'
  })
  startDate: string;

  @ApiProperty({
    title: '下架時間',
    example: '',
    description: '下架時間'
  })
  endDate: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '集點卡建立的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '集點卡建立的角色'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023/06/19 17:27:37',
    description: '集點卡更新資料的時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wei',
    description: '集點卡更新資料的角色'
  })
  alterName: string;
}

export class GetRewardCardSettingListResp {
  @ApiProperty({ type: [RewardCardSettingList] })
  rewardCardSettingList: RewardCardSettingList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
