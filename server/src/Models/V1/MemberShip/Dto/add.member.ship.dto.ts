import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class Setting {
  @ApiProperty({
    title: '基本幾點設定選項',
    example: 'Fix',
    description: '比例贈點Ratio/固定贈點Fix',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  pointType: string;

  @ApiProperty({
    title: '是否有勾選',
    example: true,
    description: '是否有勾選 checkBox',
    required: true
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiPropertyOptional({
    title: '滿金額',
    example: 1000,
    description: '消費滿？元',
    required: true
  })
  @IsOptional()
  @IsNumber()
  purchasedSum: number;

  @ApiPropertyOptional({
    title: '每___金額',
    example: 100,
    description: '每？元',
    required: false
  })
  @IsOptional()
  @IsNumber()
  purchasedEvery: number;

  @ApiPropertyOptional({
    title: '贈送__點',
    example: 100,
    description: '贈送幾點',
    required: true
  })
  @IsOptional()
  @IsNumber()
  purchasedPoint: number;
}

export class BasicSetting {
  @ApiPropertyOptional({
    title: '積點效期',
    example: 0,
    description: '積點效期',
    required: false
  })
  @IsOptional()
  @IsNumber()
  activeStatus: number;

  @ApiPropertyOptional({
    title: '積點效期幾天',
    example: 30,
    description: '積點效期幾天',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  activeDay: number;

  @ApiPropertyOptional({
    type: [Setting]
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => Setting)
  setting: Setting[];
}

export class Birthdayetting {
  @ApiPropertyOptional({
    title: '積點效期',
    example: 0,
    description: '積點效期',
    required: false
  })
  @IsOptional()
  @IsNumber()
  activeStatus: number;

  @ApiPropertyOptional({
    title: '積點效期幾天',
    example: 30,
    description: '積點效期幾天',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  activeDay: number;

  @ApiPropertyOptional({
    type: [Setting]
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => Setting)
  setting: Setting[];
}

export class AddMemberShipDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '是否發布',
    example: false,
    description: 'true:發布/false:僅存成草稿',
    required: true
  })
  @IsNotEmpty()
  @IsBoolean()
  isRelease: boolean;

  @ApiProperty({
    title: '會籍通用設定編號',
    example: 'M004',
    description: '會籍通用設定編號',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  settingId: string;

  @ApiPropertyOptional({
    title: '單筆會籍編號',
    example: 'M00401',
    description: '單筆會籍編號',
    required: false
  })
  @IsOptional()
  @IsString()
  memberShipId: string;

  @ApiProperty({
    title: '單筆會籍名稱',
    example: '星卡',
    description: '單筆會籍名稱',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  memberShipName: string;

  @ApiPropertyOptional({
    title: '下一階層會籍代碼',
    example: 'M00402',
    description: '下一階層會籍代碼',
    required: false
  })
  @IsOptional()
  @IsString()
  nextMemberShip: string;

  @ApiProperty({
    title: '會籍期限內消費滿？次',
    example: 5,
    description: '會籍期限內消費滿？次',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(99)
  purchasedCount: number;

  @ApiProperty({
    title: '會籍期限內消費滿？元',
    example: 10000,
    description: '會籍期限內消費滿？元',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(999999)
  purchasedTimes: number;

  @ApiProperty({
    title: '會員到期異動方式',
    example: 0,
    description: '會員到期異動方式',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  expiresChange: number;

  @ApiProperty({
    type: [BasicSetting]
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => BasicSetting)
  basicSetting: BasicSetting;

  @ApiProperty({
    type: [Birthdayetting]
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Birthdayetting)
  birthdaySetting: Birthdayetting;

  @ApiProperty({
    title: '升等禮',
    example: ['C2308090006'],
    description: '發放規則為升等禮的兌換券 ID',
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  upgradeCouponIds: string[];

  @ApiProperty({
    title: '續會禮',
    example: ['C2308090007'],
    description: '發放規則為續會禮的兌換券 ID',
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  renewalCouponIds: string[];
}

export class AddMemberShipResp {
  memberShipId: string;
}
