import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PermissionChildDto {
  @ApiProperty()
  @IsString()
  permissionId: string;

  @ApiProperty()
  @IsString()
  permissionCode: string;

  @ApiProperty()
  @IsString()
  permissionName: string;
}

export class GetPermissionDto {
  @ApiProperty()
  @IsString()
  permissionId: string;

  @ApiProperty()
  @IsString()
  permissionCode: string;

  @ApiProperty()
  @IsString()
  permissionName: string;

  @ApiProperty({ type: [PermissionChildDto] })
  child: PermissionChildDto[];
}

export class GetAuthItemsDto {
  @ApiProperty()
  @IsString()
  roleId: string;

  @ApiProperty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [GetPermissionDto] })
  permissions: GetPermissionDto[];

  @ApiProperty()
  @IsString()
  totalCount: string;
}
