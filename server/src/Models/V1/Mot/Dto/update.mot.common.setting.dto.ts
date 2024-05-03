import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class UpdateMotCommonSettingDto extends PartialType(IamObjectDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  settingId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(99)
  maxPush: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  templateColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  btnColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  btnWord: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  btnWording: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  btnLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}
