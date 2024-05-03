import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class GiftDetails {
  @ApiProperty({
    title: '渠道 ID',
    example: 'Ch0001',
    description: '渠道管理編號',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  channelId: string;

  @ApiProperty({
    title: '兌換券 ID',
    examples: ['C2308090001', 'C2308090002'],
    description: '兌換券管理編號',
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  couponIds: string[];
}

export class AddMemberShipSettingDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '是否發布',
    example: false,
    description: 'true:發布/false:僅存成草稿',
    required: true
  })
  @IsNotEmpty()
  @IsBoolean()
  isRelease: boolean;

  @ApiPropertyOptional({
    title: '會籍通用設定編號',
    example: 'M004',
    description: '會籍通用設定編號',
    required: false
  })
  @IsOptional()
  @IsString()
  settingId: string;

  @ApiProperty({
    title: '會籍通用設定名稱',
    example: '尚未發布的草稿',
    description: '會籍通用設定名稱',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  settingName: string;

  @ApiProperty({
    title: '會籍預定生效日',
    example: '2023/08/26',
    description: '會籍預定生效日',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({
    title: '會籍起始日計算',
    example: 1,
    description: '會籍起始日計算',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  startDateCount: number;

  @ApiProperty({
    title: '會籍續等/升等期限',
    example: 5,
    description: '會籍起始日開始？年內',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  startDateYear: number;

  @ApiProperty({
    title: '會籍到期日',
    example: 1,
    description: '會籍到期日',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  endDate: number;

  @ApiProperty({
    title: '消費計算-升等',
    example: 1,
    description: '消費計算-升等',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  consumptionUpgrade: number;

  @ApiProperty({
    title: '消費計算-到期',
    example: 1,
    description: '消費計算-到期',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  consumptionDue: number;

  @ApiProperty({
    title: '續會/升等禮_日',
    example: 1,
    description: '？日後發送禮品',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(99)
  upgradeDay: number;

  @ApiProperty({
    title: '續會/升等禮可領取次數',
    example: 1,
    description: '續會/升等禮可領取次數',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  upgradeNum: number;

  @ApiPropertyOptional({ type: [GiftDetails] })
  gift: GiftDetails[];
}

export class AddMemberShipSettingResp {
  settingId: string;
}
