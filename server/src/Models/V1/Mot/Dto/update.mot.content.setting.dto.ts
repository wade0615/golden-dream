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

export class UpdateMotContentSettingDto extends PartialType(IamObjectDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  memberShipId: string;

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
    title: '測試發送通知分類',
    example: '[]',
    required: false
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  notifyClass: string[];

  @ApiProperty({
    title: 'sms 內容'
  })
  @IsString()
  @IsNotEmpty()
  smsContent: string;

  @ApiProperty({
    title: 'app 推播 title'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  appPushTitle: string;

  @ApiProperty({
    title: 'app 推播 內容'
  })
  @IsString()
  @IsNotEmpty()
  appPushContent: string;

  @ApiProperty({
    title: '訊息匣縮圖'
  })
  @IsString()
  @IsNotEmpty()
  msgImg: string;

  @ApiProperty({
    title: '訊息來源',
    example: 1,
    description: '0:無、1:內部連結、2:外部連結'
  })
  @IsNumber()
  @IsNotEmpty()
  msgSource: number;

  @ApiProperty({
    title: '訊息來源下面的網址'
  })
  @IsString()
  @IsNotEmpty()
  msgUrl: string;

  @ApiProperty({
    title: '訊息類型'
  })
  @IsNumber()
  @IsNotEmpty()
  msgType: number;

  @ApiProperty({
    title: 'email title'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  emailTitle: string;

  @ApiProperty({
    title: 'email 內容'
  })
  @IsString()
  @IsNotEmpty()
  emailContent: string;

  @ApiProperty({
    title: '完整的 email 內容'
  })
  @IsString()
  @IsNotEmpty()
  fullEmailContent: string;

  @ApiProperty({
    title: '模板圖片 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  templatePhotoRdo: number;

  @ApiProperty({
    title: '模板圖片'
  })
  @IsString()
  @IsOptional()
  templatePhotoImg: string;

  @ApiProperty({
    title: '模板底色 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  templateColorRdo: number;

  @ApiPropertyOptional({
    title: '模板色碼'
  })
  @IsString()
  @IsOptional()
  @MaxLength(6)
  templateColor: string;

  @ApiProperty({
    title: '內文按鈕 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  contentRdo: number;

  @ApiProperty({
    title: '按鈕底色 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  btnColorRdo: number;

  @ApiPropertyOptional({
    title: '按鈕底色'
  })
  @IsString()
  @IsOptional()
  @MaxLength(6)
  btnColor: string;

  @ApiProperty({
    title: '按鈕文字顏色 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  btnWordRdo: number;

  @ApiPropertyOptional({
    title: '按鈕文字顏色'
  })
  @IsString()
  @IsOptional()
  @MaxLength(6)
  btnWord: string;

  @ApiProperty({
    title: '按鈕文案 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  btnWordingRdo: number;

  @ApiPropertyOptional({
    title: '按鈕文案'
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  btnWording: string;

  @ApiProperty({
    title: '按鈕連結 預設/自訂',
    example: 1,
    description: '0:預設、1:自訂'
  })
  @IsNumber()
  @IsNotEmpty()
  btnLinkRto: number;

  @ApiPropertyOptional({
    title: '按鈕連結'
  })
  @IsString()
  @IsOptional()
  btnLink: string;
}
