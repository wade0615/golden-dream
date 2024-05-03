import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMemberPassword {
  @ApiProperty()
  @IsString()
  mobileCountryCode: string;

  @ApiProperty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  newPwd: string;
}
