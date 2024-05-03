import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class GetUserInfoRes {
  @ApiProperty({
    title: '用戶名稱'
  })
  @IsString()
  name: string;

  @ApiProperty({
    title: '是否為管理員'
  })
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({
    title: '權限列表'
  })
  authItems: any[];
}
