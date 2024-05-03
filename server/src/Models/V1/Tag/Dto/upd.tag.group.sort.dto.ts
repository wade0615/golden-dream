import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdTagGroupSortDto {
  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  tagGroupIds: number[];

  iam: IamDto;
}
