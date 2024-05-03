import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DelRewardSendDetailDto {
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
