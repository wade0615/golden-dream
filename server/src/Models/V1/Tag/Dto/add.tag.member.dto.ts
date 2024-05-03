import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddTagMemberDto {
  @ApiProperty({
    title: '標籤編號',
    examples: ['1', '2'],
    description: '多筆標籤編號',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  tagIds: number[];

  @ApiProperty({
    title: '發放指定的會員手機國碼',
    example: '+886',
    description: '會員手機國碼',
    required: false
  })
  @IsString()
  @IsOptional()
  mobileCountryCode: string;

  @ApiProperty({
    title: '發放指定的會員手機號碼',
    example: '912345678',
    description: '會員手機號碼',
    required: false
  })
  @IsString()
  @IsOptional()
  mobile: string;

  @ApiProperty({
    title: '指定會員 Excel',
    example: 'https://localhost/',
    description: 'excel url',
    required: false
  })
  @IsString()
  @IsOptional()
  memberExcelUrl: string;
}
