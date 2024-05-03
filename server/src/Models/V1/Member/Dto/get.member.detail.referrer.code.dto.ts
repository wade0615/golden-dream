import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberDetailReferrerCodeDto {
  @ApiProperty({
    title: '個人推薦碼',
    example: 'HouHouGPT',
    description: '推薦碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  referralCode: string;
}

export class GetMemberDetailReferrerCodeResp {
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
