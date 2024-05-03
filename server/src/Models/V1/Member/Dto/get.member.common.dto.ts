import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberCommonDataDto {
  @ApiProperty({
    title: '會員編號',
    example: 'M00000001',
    description: '長度為10的會員編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class GetMemberCommonDataResp {
  @ApiProperty({
    title: '會員名稱',
    example: '王小明',
    description: '會員姓名'
  })
  name: string;

  @ApiProperty({
    title: '手機號碼',
    example: '9123456789',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '手機國碼',
    example: '+886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '特殊類型',
    example: '集團員工',
    description: '根據特殊類型設置'
  })
  specialTypeName: string;

  @ApiProperty({
    title: '會籍',
    example: '星卡',
    description: '根據會籍管理設置'
  })
  membershipStatus: string;
}
