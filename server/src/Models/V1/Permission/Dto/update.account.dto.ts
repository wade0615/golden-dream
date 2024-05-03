import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdateAccountDto {
  @ApiProperty({
    title: '後台登入帳號',
    required: true
  })
  @IsString()
  authMemberId: string;

  @ApiProperty({
    title: '後台登入帳號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiPropertyOptional({
    title: '登入密碼',
    required: false
  })
  @IsOptional()
  @IsString()
  pwd: string;

  @ApiPropertyOptional({
    title: '確認密碼',
    required: false
  })
  @IsOptional()
  @IsString()
  checkPwd: string;

  @ApiProperty({
    title: '帳號名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  authName: string;

  @ApiProperty({
    title: '信箱',
    required: true
  })
  @IsString()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @ApiProperty({
    title: '帳號名稱',
    required: true
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    title: '角色id',
    required: false
  })
  roleList: string[];

  @ApiProperty({
    title: '部門',
    required: false
  })
  departmentList: string[];

  iam: IamDto;
}

export class UpdateAccountStateDto {
  @ApiProperty({
    title: '帳號id',
    required: true
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  authMemberId: string[];

  @ApiProperty({
    title: '狀態代碼',
    required: true,
    description: '0.停用 1. 啟用'
  })
  state: number;
}
