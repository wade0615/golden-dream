import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdNotifyMemberDetailDto {
  @ApiProperty({
    title: '通知人員流水號',
    example: '1',
    description: '依照通知人員表設定，帶入空值代表新增',
    required: false
  })
  @IsNumber()
  @IsOptional()
  userSeq: number;

  @ApiProperty({
    title: '通知人員暱稱',
    example: '人員001',
    description: '通知人員暱稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: '手機國碼',
    example: '886',
    description: '手機國碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '912345678',
    description: '手機號碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    title: '電子郵件',
    example: 'abc@gmail.com',
    description: '電子郵件',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: [Number],
    title: '通知分類流水號',
    examples: [1, 2],
    description: '依照通知分類表設定',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  notifyGroupIds: number[];

  iam: IamDto;
}
