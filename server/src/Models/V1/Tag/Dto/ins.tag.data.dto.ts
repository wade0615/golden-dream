import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class InsTagDataDto {
  @ApiProperty({
    title: '標籤編號',
    example: '1',
    description: '標籤編號',
    required: false
  })
  @IsNumber()
  @IsOptional()
  tagId: number;

  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  tagGroupId: number;

  @ApiProperty({
    title: '標籤名稱',
    example: '標籤',
    description: '標籤名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  tagName: string;

  @ApiProperty({
    title: '標籤狀態',
    example: 'DISABLE',
    description: 'DISABLE：啟用; ENABLE：停用',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    title: '啟用時間狀態',
    example: 'PERMANENT',
    description: 'PERMANENT：永久; RANGE：結束時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  dateState: string;

  @ApiProperty({
    title: '結束時間',
    example: '2023/01/01',
    description: '結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    title: '描述',
    example: '描述123',
    description: '描述',
    required: false
  })
  @IsString()
  @IsOptional()
  description: string;

  iam: IamDto;
}
