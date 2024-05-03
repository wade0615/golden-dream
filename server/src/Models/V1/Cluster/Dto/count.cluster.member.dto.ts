import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CountClusterMemberDto {
  @ApiProperty({
    title: '匯出時間',
    example: 'immediate',
    description:
      '匯出時間，immediate：即時; specifiedDate：指定日期; everyHalfMonth：每半月; everyMonth：每個月; everyQuarter：每一季; specifiedRangeDate：指定範圍日期',
    required: false
  })
  @IsString()
  @IsOptional()
  exportStatus: string;

  @ApiProperty({
    title: '每滿 N 個月',
    example: '1',
    description: '每滿 N 個月',
    required: false
  })
  @IsNumber()
  @IsOptional()
  monthEvery: number;

  @ApiPropertyOptional({
    title: '發送對象',
    example: 'all',
    description: 'all：全部會員/import：名單匯入/target：目標會員',
    required: false
  })
  @IsString()
  @IsOptional()
  sendTarget: string;

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
}

export class CountClusterMemberResp {
  @ApiProperty({
    title: '會員總數',
    example: '1000000',
    description: '會員總數'
  })
  totalMemberCount: number;

  @ApiProperty({
    title: '觸及人數',
    example: '425000',
    description: '觸及人數'
  })
  touchMemberCount: number;

  @ApiProperty({
    title: '發送信件人數',
    example: '425000',
    description: '發送信件人數'
  })
  memberSendEmailCount: number;

  @ApiProperty({
    title: '發送簡訊人數',
    example: '425000',
    description: '發送簡訊人數'
  })
  memberSendSmsCount: number;

  @ApiProperty({
    title: '發送APP推播人數',
    example: '425000',
    description: '發送APP推播人數'
  })
  memberSendAppCount: number;
}
