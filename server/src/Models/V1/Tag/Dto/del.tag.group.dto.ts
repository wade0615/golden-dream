import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelTagGroupDto {
  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  tagGroupId: number;

  iam: IamDto;
}
