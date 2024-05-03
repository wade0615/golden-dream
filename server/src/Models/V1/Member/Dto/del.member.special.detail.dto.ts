import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelMemberSpecialDetailDto {
  @ApiProperty({
    title: '特殊類型流水號',
    example: '1',
    description: '特殊類型流水號',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  specialId: number;

  iam: IamDto;
}
