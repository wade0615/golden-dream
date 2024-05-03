import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelTagDataDto {
  @ApiProperty({
    title: '標籤編號',
    examples: [1, 2],
    description: '標籤的編號',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  tagIds: number[];

  iam: IamDto;
}
