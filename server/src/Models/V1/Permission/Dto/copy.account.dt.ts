import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class CopyAccountDto {
  @ApiProperty({
    title: '後台登入帳號',
    required: true
  })
  @IsString()
  copyAuthMemberId: string;

  @ApiProperty({
    title: '後台登入帳號',
    required: true
  })
  @IsString()
  account: string;

  @ApiProperty({
    title: '登入密碼',
    required: true
  })
  @IsString()
  pwd: string;

  @ApiProperty({
    title: '確認密碼',
    required: true
  })
  @IsString()
  checkPwd: string;

  @ApiProperty({
    title: '帳號名稱',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
    title: '信箱',
    required: true
  })
  @IsString()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @ApiProperty({
    title: '角色id',
    required: false
  })
  roleList: string[];

  @ApiProperty({
    title: '部門',
    required: false
  })
  @IsOptional()
  departmentList: string[];

  @ApiProperty({
    title: '備註',
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;

  iam: IamDto;
}
