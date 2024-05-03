import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IMAGE_UPLOAD_TYPE } from 'src/Definition/Enum/image.upload.type.enum';

export class UploadImageDto {
  @ApiProperty({
    title: '圖片上傳的類型',
    example: 'coupon_main_image',
    description:
      '圖片上傳的類型，coupon_main_image: 兌換券主圖; coupon_thumbnail_image: 兌換券縮圖',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  imageUploadType: IMAGE_UPLOAD_TYPE;
}

export class UploadImageResp {
  @ApiProperty({
    title: '圖片上傳的網址',
    examples: ['http://127.0.0.1/'],
    description: '上傳至 GCP 的圖片網址'
  })
  urls: string[];
}
