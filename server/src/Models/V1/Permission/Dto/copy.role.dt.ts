import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class CopyRoletDto {
  @ApiProperty({
    title: '複製對象角色id',
    required: true
  })
  @IsString()
  copyRoleId: string;

  iam: IamDto;
}
