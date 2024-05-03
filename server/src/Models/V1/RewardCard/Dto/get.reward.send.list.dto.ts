import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetRewardSendListDto {
  @ApiProperty({
    title: '集點調整狀態',
    example: 'NOT_START',
    description: 'END: 已結束; NOT_START:  尚未開始',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

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

export class RewardSendList {
  @ApiProperty({
    title: '集點發送 ID',
    default: 'RIS2309060002',
    description: '集點發送編號'
  })
  risId: string;

  @ApiProperty({
    title: '集點發送名稱',
    default: '增點活動',
    description: '集點發送名稱'
  })
  risName: string;

  @ApiProperty({
    title: '集點類型',
    default: '1',
    description: '1: 增點 2: 扣點'
  })
  risType: number;

  @ApiProperty({
    title: '執行時間',
    default: '2023-09-06T00:00:00.000Z',
    description: '執行時間'
  })
  risDate: string;

  @ApiProperty({
    title: '點數',
    example: '10',
    description: '點數'
  })
  rewardPoint: number;

  @ApiProperty({
    title: '會員類型',
    example: 'IMPORT',
    description: '會員類型，IMPORT：批量匯入; ASSIGN：指定會員'
  })
  memberType: string;

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

  relationId: string;
}

export class GetRewardSendListResp {
  @ApiProperty({ type: [RewardSendList] })
  rewardSendList: RewardSendList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
