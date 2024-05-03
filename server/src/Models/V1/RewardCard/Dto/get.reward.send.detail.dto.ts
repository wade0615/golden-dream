import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRewardSendDetailDto {
  @ApiProperty({
    title: '集點發送 ID',
    default: 'RIS2309060002',
    description: '集點發送編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  risId: string;
}

export class GetRewardSendDetailResp {
  @ApiProperty({
    title: '集點類型',
    default: '1',
    description: '1: 增點 2: 扣點'
  })
  risType: number;

  @ApiProperty({
    title: '集點發送名稱',
    default: '增點活動',
    description: '集點發送名稱'
  })
  risName: string;

  @ApiProperty({
    title: '集點卡 ID',
    example: 'RC2308150001',
    description: '集點卡編號'
  })
  rewardCardId: string;

  @ApiProperty({
    title: '集點調整時間規則',
    example: '1',
    description: '1: 依每日排程 2: 指定發送日'
  })
  risStatus: number;

  @ApiProperty({
    title: '指定發送日',
    example: '2023-09-06T00:00:00.000Z',
    description: '指定發送日期'
  })
  risDate: string;

  @ApiProperty({
    title: '消費日期',
    example: '2023-09-06T00:00:00.000Z',
    description: '消費日期'
  })
  consumeDate: string;

  @ApiProperty({
    title: '匯入 Excel URL',
    example: '1',
    description: 'https://localhost'
  })
  excelUrl: string;

  @ApiProperty({
    title: '會員資料筆數',
    example: '10',
    description: '會員資料筆數'
  })
  memberExcelCount: number;

  @ApiProperty({
    title: '集點卡點數',
    example: '10',
    description: '集點卡點數'
  })
  rewardPoint: number;

  @ApiProperty({
    title: '門市 ID',
    default: 'S2212290072',
    description: '門市編號'
  })
  storeId: string;

  @ApiProperty({
    title: '備註',
    example: '',
    description: '備註'
  })
  remark: string;

  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '912345678',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '會員編號',
    default: 'M00000001',
    description: '長度為10的會員編號',
    required: true
  })
  memberId: string;
}
