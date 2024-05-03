import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelRewardCardSettingDetailDto {
  @ApiProperty({
    title: '集點卡 ID',
    example: 'RC2308150001',
    description: '集點卡編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  rewardCardId: string;

  iam: IamDto;
}
