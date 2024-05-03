import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class AddRoleDto {
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

export class AddRoleRes {
  @ApiProperty({
    title: '角色id',
    required: false
  })
  @IsString()
  roleId: string;
}
