import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class PointSetting {
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
  handselPoint: number;
}

export class Brand {
  @ApiPropertyOptional({
    title: '品牌編號',
    description: '品牌編號',
    required: false
  })
  @IsOptional()
  @IsString()
  brandId: string;

  @ApiPropertyOptional({
    title: '門市編號',
    description: '門市編號',
    required: false
  })
  @IsOptional()
  @IsArray()
  storeId: string[];
}

export class AddConsSettingtDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '活動編號',
    example: 'R230823001',
    description: '活動編號',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardId: string;

  @ApiProperty({
    title: '活動名稱',
    example: '搶頭香活動',
    description: '活動名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  rewardName: string;

  @ApiProperty({
    title: '開始時間',
    example: 'yyyy/mm/dd HH:mm:ss',
    description: '開始時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '結束時間',
    example: 'yyyy/mm/dd HH:mm:ss',
    description: '結束時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    title: '排除時間',
    example: '[yyyy/mm/dd HH:mm:ss,yyyy/mm/dd HH:mm:ss]',
    description: '排除時間',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  excludeDate: string[];

  @ApiProperty({
    title: '通用渠道',
    example: '[Ch001,Ch002]',
    description: '通用渠道',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  channelId: string[];

  @ApiProperty({
    title: '會籍',
    description: '會籍',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  memberShip: string[];

  @ApiProperty({
    title: '指定餐期',
    description: '指定餐期',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  mealPeriod: number[];

  @ApiProperty({
    title: '積點回饋設定',
    description: '積點回饋設定',
    required: true,
    type: [PointSetting]
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PointSetting)
  pointSetting: PointSetting[];

  @ApiProperty({
    title: '品牌門市',
    description: '品牌門市',
    required: true,
    type: [Brand]
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Brand)
  brand: Brand[];

  @ApiProperty({
    title: '商品',
    description: '商品',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  product: string[];

  @ApiProperty({
    title: '積點效期',
    example: '積點預設效期0/指定天數1',
    description: '積點效期',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  activeStatus: number;

  @ApiProperty({
    title: '指定幾天',
    example: '3',
    description: '指定幾天',
    required: false
  })
  @IsNumber()
  @IsOptional()
  activeDay: number;

  @ApiProperty({
    title: '全部門市0/指定門市1',
    description: '全部門市0/指定門市1',
    required: false
  })
  @IsNumber()
  @IsNotEmpty()
  selectStore: number;
}
