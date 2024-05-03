import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResendSmsMessage {
  @ApiProperty()
  @IsString()
  mobileCountryCode: string;

  @ApiProperty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  memberId: string;
}
