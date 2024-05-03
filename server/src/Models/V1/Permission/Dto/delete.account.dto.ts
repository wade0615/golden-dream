import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({
    title: '後台會員id',
    required: true
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  authMemberId: string[];
}
