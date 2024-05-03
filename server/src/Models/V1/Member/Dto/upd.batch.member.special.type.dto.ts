import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdBatchMemberSpecialTypeDto {
  @ApiProperty({
    title: '設定類型',
    example: '1',
    description: '1: 新增, 2: 移除',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    title: '特殊會員類型流水號',
    example: '1',
    description: '根據特殊會員設定資料',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  specialTypeSeq: string;

  iam: IamDto;
}
