import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class ExportCsvDataDto {
  @ApiProperty({
    title: '匯出類型',
    example: 'memberTag',
    description:
      'memberInfo: 會員資料; memberTag: 會員標籤; orderDetail: 消費紀錄; pointLog: 積點明細; couponDetail: 優惠券明細; commodityDetail: 商品券明細; rewardDetail: 集點卡明細; ',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    title: '各匯出所需參數',
    example: '',
    description: '各匯出所需參數',
    required: false
  })
  @IsOptional()
  params: any;

  iam: IamDto;
}
