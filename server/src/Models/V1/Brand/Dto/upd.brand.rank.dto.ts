import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdBrandRankDto {
  @ApiProperty({
    title: '品牌順序',
    examples: ['TT', 'TX'],
    description: '品牌的順序，集團必須為第一個排序',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  brandSorts: string[];

  iam: IamDto;
}
