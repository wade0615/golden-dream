import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRolePermissionDto {
  @ApiProperty({
    title: '角色id',
    required: true
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    title: '權限清單',
    required: true
  })
  permissionList: string[];
}
