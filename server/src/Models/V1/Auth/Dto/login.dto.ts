import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    title: '後台登入帳號',
    required: true
  })
  @IsString()
  act: string;

  @ApiProperty({
    title: '密碼',
    required: true
  })
  @IsString()
  pwd: string;
}

export class LoginResDto {
  @ApiProperty({
    title: '驗證token',
    required: true
  })
  accessToken: string;

  @ApiProperty({
    title: '重置token',
    required: true
  })
  refreshToken: string;
}
