import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';
import { NegativeData } from './upd.cluster.setting.dto';

export class Condition {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  memberShipId: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  numFirst: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  numSec: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  amountStart: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  amountEnd: number;
}

export class UpdateMotSettingDto extends PartialType(IamObjectDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    title: '狀態',
    example: 'draft',
    description: '儲存草稿：draft/啟用：enable',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  motStatus: string;

  @ApiProperty({
    type: [Condition]
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Condition)
  condition: Condition[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(300)
  des: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  sendMethod: string[];

  @ApiProperty({
    title: '排除條件',
    example: '[{}]',
    description: '排除條件，詳情見分群條件範例',
    required: false,
    type: [NegativeData]
  })
  @IsOptional()
  negativeData: NegativeData[];
}
