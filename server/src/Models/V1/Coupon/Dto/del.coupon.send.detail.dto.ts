import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelCouponSendDetailDto {
  @ApiProperty({
    title: '發放 ID',
    example: 'C230811006',
    description: '發放編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  sendId: string;

  iam: IamDto;
}
