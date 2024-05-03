import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelNotifyMemberDetailDto {
  @ApiProperty({
    title: '通知人員流水號',
    example: '1',
    description: '依照通知人員表設定',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  userSeq: number;

  iam: IamDto;
}
