import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelCouponSettingDetailDto {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  couponId: string;

  iam: IamDto;
}
