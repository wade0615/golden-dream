import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetRoleListRes {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  state: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  alterDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  alterName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalCount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  homePage: string;
}
