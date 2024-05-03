import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class InsTagGroupDto {
  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號',
    required: false
  })
  @IsNumber()
  @IsOptional()
  tagGroupId: number;

  @ApiProperty({
    title: '標籤分類名稱',
    example: '群組一號',
    description: '標籤分類名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  tagGroupName: string;

  iam: IamDto;
}
