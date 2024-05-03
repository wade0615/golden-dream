import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdStoreDetailDto {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    title: '門市編號',
    example: 'S2212290071',
    description: '門市編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    title: '商場名稱',
    example: '商場名稱',
    description: '商場名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mallName: string;

  @ApiProperty({
    title: 'POS商店代碼',
    example: 'KH001',
    description: 'POS機的代碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  posCode: string;

  @ApiProperty({
    title: '門市人數',
    example: '15',
    description: '門市人數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  peopleCount: number;

  iam: IamDto;

  @ApiProperty({
    title: '縣市',
    example: '70001',
    description: '縣市',
    required: false
  })
  @IsString()
  @IsOptional()
  cityCode: string;

  @ApiProperty({
    title: '區域',
    example: '100',
    description: '區域',
    required: false
  })
  @IsString()
  @IsOptional()
  zipCode: string;
}
