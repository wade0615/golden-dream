import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class NegativeData {
  @ApiPropertyOptional({
    title: '主分類類型',
    example: 'basic',
    description:
      'basic：基本資料、memberActivities：會員活動、consume：消費行為',
    required: false
  })
  @IsString()
  @IsOptional()
  clusterType: string;

  @ApiPropertyOptional({
    title: 'AND/OR條件',
    example: 'AND',
    description: 'AND/OR條件',
    required: false
  })
  @IsString()
  @IsOptional()
  conditional: string;

  @ApiPropertyOptional({
    title: '分群設定資訊',
    example: '[{}]',
    description: '分群設定資訊',
    required: false
  })
  @IsString()
  @IsOptional()
  setting: string;
}

export class UpdateMotClusterSettingDto {
  @ApiPropertyOptional({
    title: '分群ID',
    example: 'CL0001',
    description: '分群ID',
    required: false
  })
  @IsString()
  @IsOptional()
  clusterId: string;

  @ApiProperty({
    title: '狀態',
    example: 'draft',
    description: '儲存草稿：draft/啟用：enable',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  motStatus: string;

  @ApiProperty({
    title: '群發類型',
    example: 'single',
    description: 'regular：定期/single：單次',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({
    title: '分群名稱',
    example: '分群名稱0001',
    description: '分群名稱',
    required: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  clusterName: string;

  @ApiPropertyOptional({
    title: '分群描述',
    example: '描述',
    description: '分群描述',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  clusterDescription: string;

  @ApiPropertyOptional({
    title: '發送時間',
    example: '',
    description:
      'immediate：即時/specifiedDate：指定日期/everyDay：每日/everyMonth：每月',
    required: false
  })
  @IsString()
  @IsOptional()
  motSendStatus: string;

  @ApiPropertyOptional({
    title: '發送起始日期',
    example: '',
    description: '發送起始日期',
    required: false
  })
  @IsString()
  @IsOptional()
  sendStartDate: string;

  @ApiPropertyOptional({
    title: '發送結束日期',
    example: '',
    description: '匯出結束日期',
    required: false
  })
  @IsString()
  @IsOptional()
  sendEndDate: string;

  @ApiPropertyOptional({
    title: '每月？日',
    example: '',
    description: '每月？日',
    required: false
  })
  @IsNumber()
  @IsOptional()
  sendDay: number;

  @ApiPropertyOptional({
    title: '發送時間',
    example: '',
    description: '發送時間',
    required: false
  })
  @IsString()
  @IsOptional()
  sendTime: string;

  @ApiPropertyOptional({
    title: '發送前？日內資料統計',
    example: 4,
    description: '發送前？日內資料統計',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Max(999)
  sendDayBefore: number;

  @ApiPropertyOptional({
    title: '發送對象',
    example: '["sms","app"]',
    required: true
  })
  @IsArray()
  @IsOptional({ each: true })
  sendMethod: string[];

  @ApiPropertyOptional({
    title: '發送對象',
    example: 'all',
    description: 'all：全部會員/import：名單匯入/target：目標會員',
    required: false
  })
  @IsString()
  @IsOptional()
  sendTarget: string;

  @ApiPropertyOptional({
    title: '檔案連結',
    description: '檔案連結',
    required: false
  })
  @IsString()
  @IsOptional()
  fileUrl: string;

  @ApiPropertyOptional({
    title: '分群條件',
    example: '[{}]',
    description: '分群條件，詳情見分群條件範例',
    required: true,
    type: [NegativeData]
  })
  @IsOptional()
  positiveData: NegativeData[];

  @ApiPropertyOptional({
    title: '排除條件',
    example: '[{}]',
    description: '排除條件，詳情見分群條件範例',
    required: false,
    type: [NegativeData]
  })
  @IsOptional()
  negativeData: NegativeData[];

  @ApiPropertyOptional({
    title: '觸及人數',
    example: '100',
    description: '會員觸及人數',
    required: true
  })
  @IsNumber()
  @IsOptional()
  peopleCount: number;

  @ApiPropertyOptional({
    title: '發送信件人數',
    example: '425000',
    description: '發送信件人數',
    required: true
  })
  @IsNumber()
  @IsOptional()
  memberSendEmailCount: number;

  @ApiPropertyOptional({
    title: '發送簡訊人數',
    example: '425000',
    description: '發送簡訊人數',
    required: true
  })
  @IsNumber()
  @IsOptional()
  memberSendSmsCount: number;

  @ApiPropertyOptional({
    title: '發送APP推播人數',
    example: '425000',
    description: '發送APP推播人數',
    required: true
  })
  @IsNumber()
  @IsOptional()
  memberSendAppCount: number;

  iam: IamDto;
}

export class UpdateMotClusterSettingResp {
  @ApiPropertyOptional({
    title: '分群ID',
    example: 'CL0001',
    description: '分群ID',
    required: false
  })
  clusterId: string;
}
