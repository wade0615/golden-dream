import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdCouponStores {
  @ApiProperty({
    title: '品牌 ID',
    example: 'TT',
    description: '依照品牌管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    title: '門市 ID',
    example: 'S2212290072',
    description: '依照門市管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;
}

export class UpdCouponSettingDetailDto {
  @ApiProperty({
    title: '兌換券 ID',
    example: 'C2308090001',
    description: '兌換券編號，空值為新增',
    required: false
  })
  @IsString()
  @IsOptional()
  couponId: string;

  @ApiProperty({
    title: '兌換券名稱',
    example: '80摳-折扣券',
    description: '兌換券名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  couponName: string;

  @ApiProperty({
    title: '兌換券類型',
    example: '1',
    description: '1: 優惠券; 2: 商品券',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  couponType: number;

  @ApiProperty({
    title: '主圖',
    example: 'https://localhost/',
    description: '主圖URL',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mainImageUrl: string;

  @ApiProperty({
    title: '縮圖',
    example: 'https://localhost/',
    description: '縮圖URL',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  thumbnailImageUrl: string;

  @ApiProperty({
    title: '發放渠道',
    example: 'Ch00001',
    description: '依照渠道管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  assignChannelId: string;

  @ApiProperty({
    title: '核銷渠道',
    example: 'Ch00001',
    description: '依照渠道管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  writeoffChannelId: string;

  @ApiProperty({
    title: '發放規則',
    example: '1',
    description:
      '1: 普通兌換; 2: 手動發放; 3: 集點卡兌換; 4: 註冊禮; 5: 續會禮; 6: 升等禮; 7: 生日禮',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  rewardRule: number;

  @ApiProperty({
    title: '兌換點數',
    example: '10',
    description: '兌換點數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  point: number;

  @ApiProperty({
    title: '發佈狀態',
    example: '1',
    description: '1: 已發佈; 0: 未發佈',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  releaseStatus: number;

  @ApiProperty({
    title: '生日年',
    example: '2023',
    description: '生日禮的指定年份',
    required: false
  })
  @IsString()
  @IsOptional()
  birthdayYear: string;

  @ApiProperty({
    title: '生日月',
    example: '12',
    description: '生日禮的指定月份',
    required: false
  })
  @IsString()
  @IsOptional()
  birthdayMonth: string;

  @ApiProperty({
    title: '上架時間',
    example: '',
    description: '上架時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '下架時間',
    example: '',
    description: '下架時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    title: '兌換規則',
    example: '1',
    description: '1: 指定時間; 2: 指定天數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  couponRule: number;

  @ApiProperty({
    title: '兌換起始時間',
    example: '',
    description: '兌換起始時間',
    required: true
  })
  @IsString()
  @IsOptional()
  redemptionStartDate: string;

  @ApiProperty({
    title: '兌換結束時間',
    example: '',
    description: '兌換結束時間',
    required: true
  })
  @IsString()
  @IsOptional()
  redemptionEndDate: string;

  @ApiProperty({
    title: '最快可取貨日',
    example: '1',
    description: '最快可取貨日',
    required: false
  })
  @IsString()
  @IsOptional()
  earliestPickupDate: string;

  @ApiProperty({
    title: '取貨期限',
    example: '',
    description: '取貨期限',
    required: false
  })
  @IsString()
  @IsOptional()
  pickupDeadline: string;

  @ApiProperty({
    title: '是否可轉贈',
    example: 'true',
    description: '1: 是; 2:否',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  isTransferable: boolean;

  @ApiProperty({
    title: '發行數量',
    example: '1000',
    description: '發行數量',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    title: '領取上限',
    example: '1',
    description: '領取上限',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  redeemLimit: number;

  @ApiProperty({
    title: '使用說明',
    example: '',
    description: '使用說明(HTML)',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    title: '品牌',
    examples: ['TT', 'X2'],
    description: '依照品牌管理設定',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  brands: string[];

  @ApiProperty({ type: [UpdCouponStores] })
  stores: UpdCouponStores[];

  @ApiProperty({
    title: '會籍 ID',
    examples: ['M1001'],
    description: '依照會籍管理設定',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  memberShip: string[];

  iam: IamDto;
}
