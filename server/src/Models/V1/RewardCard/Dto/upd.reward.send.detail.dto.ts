import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdRewardSendDetailDto {
  @ApiProperty({
    title: '集點發送 ID',
    default: 'RIS2309060002',
    description: '集點發送編號',
    required: false
  })
  @IsString()
  @IsOptional()
  risId: string;

  @ApiProperty({
    title: '集點類型',
    default: '1',
    description: '1: 增點 2: 扣點',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  risType: string;

  @ApiProperty({
    title: '集點發送名稱',
    default: '增點活動',
    description: '集點發送名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  risName: string;

  @ApiProperty({
    title: '集點卡 ID',
    example: 'RC2308150001',
    description: '集點卡編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  rewardCardId: string;

  @ApiProperty({
    title: '消費日期',
    example: '1',
    description: '2023-09-06T00:00:00.000Z',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  consumeDate: string;

  @ApiProperty({
    title: '集點調整時間規則',
    example: '1',
    description: '1: 依每日排程 2: 指定發送日',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  risStatus: string;

  @ApiProperty({
    title: '指定發送日',
    default: '2023-09-06T00:00:00.000Z',
    description: '指定發送日',
    required: false
  })
  @IsString()
  @IsOptional()
  risDate: string;

  @ApiProperty({
    title: '會員id',
    example: 'test1234',
    description: 'Member ID',
    required: false
  })
  @IsString()
  @IsOptional()
  memberId: string;

  @ApiProperty({
    title: '集點卡點數',
    example: '10',
    description: '集點卡點數',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardPoint: string;

  @ApiProperty({
    title: '門市 ID',
    default: 'S2212290072',
    description: '門市編號',
    required: false
  })
  @IsString()
  @IsOptional()
  storeId: string;

  @ApiProperty({
    title: '備註',
    example: '',
    description: '備註',
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    title: '指定會員 Excel',
    example: 'https://localhost/',
    description: 'excel url',
    required: false
  })
  @IsString()
  @IsOptional()
  memberExcelUrl: string;
}
