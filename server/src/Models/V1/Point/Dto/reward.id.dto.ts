import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class RewardIdDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '活動編號',
    example: 'A1111',
    description: '活動編號',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardId: string;
}
