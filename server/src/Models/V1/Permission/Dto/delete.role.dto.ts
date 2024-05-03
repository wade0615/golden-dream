import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DeleteRoleDto {
  @ApiProperty({
    title: '角色id',
    required: true
  })
  @IsString()
  roleId: string;

  iam: IamDto;
}
