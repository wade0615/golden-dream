import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelBrandDetailDto {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  iam: IamDto;
}
