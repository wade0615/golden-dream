import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdateRoleDto {
  @ApiProperty({
    title: '角色id',
    required: true
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    title: '角色名稱',
    required: true
  })
  @IsString()
  roleName: string;

  @ApiProperty({
    title: '角色首頁',
    required: true
  })
  @IsString()
  homePage: string;

  iam: IamDto;
}

export class updateRoleListSort {
  @ApiProperty({
    title: '角色編號清單',
    required: true
  })
  listSorts: string[];
}

export class UpdateRoleStateDto {
  @ApiProperty({
    title: '角色id',
    required: true
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    title: '狀態代碼',
    required: true,
    description: '0.停用 1. 啟用'
  })
  state: number;

  iam: IamDto;
}
