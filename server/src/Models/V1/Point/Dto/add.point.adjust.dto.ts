import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class AddPointAdjustDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '調整項目編號',
    example: 'R230823001',
    description: '調整項目編號',
    required: false
  })
  @IsString()
  @IsOptional()
  adjustId: string;

  @ApiProperty({
    title: '調整項目名稱',
    example: '搶頭香調整項目',
    description: '調整項目名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  adjustName: string;

  @ApiProperty({
    title: '增點/積點',
    example: '增點1/扣點2',
    description: '增點/扣點',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  adjustType: number;

  @ApiProperty({
    title: '消費時間',
    example: 'yyyy/mm/dd',
    description: '消費時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  consumeDate: string;

  @ApiProperty({
    title: '積點調整執行時間依系統排程/指定發放日',
    example: '依系統排程1/指定發放日2',
    description: '積點調整執行時間依系統排程/指定發放日',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  dataType: number;

  @ApiProperty({
    title: '積點調整執行時間',
    example: 'yyyy/mm/dd',
    description: '積點調整執行時間',
    required: false
  })
  @IsString()
  @IsOptional()
  adjustDate: string;

  @ApiProperty({
    title: '會員批量/指定',
    example: '批量匯入1/指定會員2',
    description: '會員批量/指定',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  memberType: number;

  @ApiProperty({
    title: '檔案連結',
    description: '檔案連結',
    required: false
  })
  @IsString()
  @IsOptional()
  fileUrl: string;

  @ApiProperty({
    title: '檔案名稱',
    description: '檔案名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  fileName: string;

  @ApiProperty({
    title: '檔案內資料筆數',
    description: '檔案內資料筆數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  fileDataCount: number;

  @ApiProperty({
    title: '國碼',
    description: '國碼',
    required: false
  })
  @IsString()
  @IsOptional()
  mobileCountryCode: string;

  @ApiProperty({
    title: '電話號碼',
    description: '電話號碼',
    required: false
  })
  @IsString()
  @IsOptional()
  mobile: string;

  @ApiProperty({
    title: '積點',
    example: 10,
    description: '積點',
    required: false
  })
  @IsNumber()
  @IsOptional()
  point: number;

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
    title: '品牌',
    description: '品牌',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    title: '門市',
    description: '門市',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    title: '備註',
    description: '備註',
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;
}
