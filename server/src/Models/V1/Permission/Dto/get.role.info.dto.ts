import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetRolePermissionDto {
  @ApiProperty({
    title: '角色id',
    required: true
  })
  @IsString()
  roleId: string;
}

export class GetRolePermissionRes {
  @ApiProperty({
    title: '最後更新時間'
  })
  @IsString()
  alterDate: string;

  @ApiProperty({
    title: '權限清單'
  })
  roleItem: string[];
}
