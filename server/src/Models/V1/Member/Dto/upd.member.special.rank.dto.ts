import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdMemberSpecialRankDto {
  @ApiProperty({
    title: '特殊會員類型順序',
    examples: ['TT', 'TX'],
    description: '特殊會員類型的順序',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  specialSorts: number[];
}
