import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberDetailByMobileDto {
  @ApiProperty({
    title: '手機號碼',
    default: '9123456789',
    description: '手機號碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    title: '手機國碼',
    default: '+886',
    description: '手機國碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobileCountryCode: string;
}

export class GetMemberDetailByMobileResp {
  @ApiProperty({
    title: '會員id',
    example: 'test1234',
    description: 'Member ID'
  })
  memberId: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'i230000123'
  })
  memberCardId: string;

  @ApiProperty({
    title: '會員姓名',
    example: 'tommy'
  })
  memberName: string;
}
