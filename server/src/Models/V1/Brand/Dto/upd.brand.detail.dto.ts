import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdBrandDetailDto {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號，空值為新增',
    default: '',
    required: false
  })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '旭集',
    description: '品牌名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: '品牌代碼',
    example: 'TT',
    description: '品牌代碼',
    required: false
  })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({
    title: '事業群名稱',
    example: '旭',
    description: '事業群',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  businessGroup: string;

  @ApiProperty({
    title: '狀態',
    example: 'true',
    description: '品牌狀態，true: 啟用 false: 不啟用',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  state: boolean;

  iam: IamDto;
}
