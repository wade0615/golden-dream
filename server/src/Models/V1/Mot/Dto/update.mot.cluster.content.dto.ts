import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class UpdateMotClusterContentDto extends PartialType(IamObjectDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clusterId: string;

  @ApiProperty({
    title: '狀態',
    example: 'draft',
    description: '儲存草稿：draft/啟用：enable',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  motStatus: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  notifyClass: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  smsContent: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(20)
  appPushTitle: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  appPushContent: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  msgImg: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  msgSource: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  msgUrl: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  msgType: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  emailTitle: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  emailContent: string;

  @ApiProperty({
    title: '完整的 email 內容'
  })
  @IsString()
  @IsOptional()
  fullEmailContent: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  templatePhotoRdo: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  templatePhotoImg: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  templateColorRdo: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(6)
  templateColor: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  contentRdo: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  btnColorRdo: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(6)
  btnColor: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  btnWordRdo: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(6)
  btnWord: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  btnWordingRdo: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(10)
  btnWording: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  btnLinkRto: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  btnLink: string;
}
