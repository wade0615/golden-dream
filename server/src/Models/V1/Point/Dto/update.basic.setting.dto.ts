import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class Channel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(99)
  fullDate: number;
}

export class UpdateBasicSettingDto extends PartialType(IamObjectDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pointId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  pointName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pointRatio: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(10)
  expiryYear: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  expiryMonth: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  expiryDate: number;

  @ApiProperty({
    type: [Channel]
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Channel)
  channel: Channel[];
}
