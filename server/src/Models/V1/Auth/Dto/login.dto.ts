import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    title: '後台登入帳號',
    description: '帳號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  act: string;

  @ApiProperty({
    title: '密碼',
    description: '密碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
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
