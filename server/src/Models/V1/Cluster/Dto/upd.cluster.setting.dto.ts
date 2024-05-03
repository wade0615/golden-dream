import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdClusterSettingDto {
  @ApiProperty({
    title: '分群ID',
    example: 'CL0001',
    description: '分群ID',
    required: false
  })
  @IsString()
  @IsOptional()
  clusterId: string;

  @ApiProperty({
    title: '分群名稱',
    example: '分群名稱0001',
    description: '分群名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  clusterName: string;

  @ApiProperty({
    title: '分群描述',
    example: '描述',
    description: '分群描述',
    required: false
  })
  @IsString()
  @IsOptional()
  clusterDescription: string;

  @ApiProperty({
    title: '匯出時間',
    example: 'immediate',
    description:
      '匯出時間，immediate：即時; specifiedDate：指定日期; everyHalfMonth：每半月; everyMonth：每個月; everyQuarter：每一季; specifiedRangeDate：指定範圍日期',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  exportStatus: string;

  @ApiProperty({
    title: '匯出起始日期',
    example: '',
    description: '匯出起始日期',
    required: false
  })
  @IsString()
  @IsOptional()
  exportStartDate: string;

  @ApiProperty({
    title: '匯出結束日期',
    example: '',
    description: '匯出結束日期',
    required: false
  })
  @IsString()
  @IsOptional()
  exportEndDate: string;

  @ApiProperty({
    title: '每滿 N 個月',
    example: '1',
    description: '每滿 N 個月',
    required: false
  })
  @IsNumber()
  @IsOptional()
  monthEvery: number;

  @ApiProperty({
    title: '下月1日匯出',
    example: 'intervalData',
    description: '區間資料: intervalData /累計資料: cumulativeData',
    required: false
  })
  @IsString()
  @IsOptional()
  exportDataType: string;

  @ApiProperty({
    title: '分群條件',
    example: '[{}]',
    description: '分群條件，詳情見分群條件範例',
    required: true
  })
  @IsNotEmpty()
  positiveData: any;

  @ApiProperty({
    title: '排除條件',
    example: '[{}]',
    description: '排除條件，詳情見分群條件範例',
    required: false
  })
  @IsOptional()
  negativeData: any;

  @ApiProperty({
    title: '匯出 Excel column',
    examples: ['1', '2'],
    description: '匯出 Excel column，詳情見分群條件範例',
    required: false
  })
  @IsArray()
  @IsOptional()
  exportParamsKey: string[];

  @ApiProperty({
    title: '通知分類',
    examples: ['1', '2'],
    description: '通知分類管理流水號',
    required: false
  })
  @IsArray()
  @IsNotEmpty()
  notifyGroupSeq: string[];

  @ApiProperty({
    title: '觸及人數',
    example: '100',
    description: '會員觸及人數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  peopleCount: number;

  iam: IamDto;
}
