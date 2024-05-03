import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IamDto {
  @ApiProperty({
    title: '後台會員id',
    required: true
  })
  // @IsString()
  authMemberId: string;
}

export class Iam {
  authMemberId: string;
}

export class IamObjectDto {
  @ApiProperty({
    title: '後台會員id',
    required: false,
    type: [Iam]
  })
  @Type(() => Iam)
  iam: Iam;
}
