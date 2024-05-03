import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class ClusterCommonSetting {
  @ApiProperty({
    title: '會員類型',
    example: 'main',
    description: '會員類型：main、drowsy、sleepy、lost',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  membersType: string;

  @ApiProperty({
    title: 'N天內有消費',
    example: '1',
    description: 'N天內有消費',
    required: false
  })
  @IsNumber()
  @IsOptional()
  consumer: number;

  @ApiProperty({
    title: 'N天內無消費',
    example: '1',
    description: 'N天內無消費',
    required: false
  })
  @IsNumber()
  @IsOptional()
  notConsumer: number;
}

export class UpdClusterCommonSettingDto {
  @ApiProperty({ type: [ClusterCommonSetting] })
  clusterCommonSetting: ClusterCommonSetting[];

  iam: IamDto;
}
