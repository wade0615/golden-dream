import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckMobileIsExistedDto {
  @ApiProperty({
    title: '國碼',
    example: '+886',
    description: '國碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobileContryCode: string;

  @ApiProperty({
    title: '電話',
    example: '+9375555555',
    description: '電話',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;
}

export class CheckMobileIsExistedResp {
  @ApiProperty({
    title: '是否存在',
    description: '是否存在'
  })
  isExisted: boolean;
}
