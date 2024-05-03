import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetNotifyMemberListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '0912345678',
    description: '暱稱/手機/Email',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'notify_name',
    description: 'notify_name: 暱稱/mobile: 手機/email: Email',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

export class NotifyMemberList {
  @ApiProperty({
    title: '通知人員流水號',
    example: '1',
    description: '依照通知人員表設定'
  })
  userSeq: number;

  @ApiProperty({
    title: '通知人員暱稱',
    example: '人員001',
    description: '依照通知人員表設定'
  })
  name: string;

  @ApiProperty({
    title: '手機國碼',
    default: '886',
    description: '手機國碼'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    default: '912345678',
    description: '手機號碼'
  })
  mobile: string;

  @ApiProperty({
    title: '電子郵件',
    default: 'abc@gmail.com',
    description: '電子郵件'
  })
  email: string;

  @ApiProperty({
    title: '所選擇的通知分類',
    default: '1',
    description: '依照下拉式多選帶入'
  })
  notifyGroupIds: number[];

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-18T10:10:41.000Z',
    description: '依照通知分類表創建時間'
  })
  createTime: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-18T10:10:41.000Z',
    description: '依照通知分類表更新時間'
  })
  alterTime: string;
}

export class GetNotifyMemberListResp {
  @ApiProperty({ type: [NotifyMemberList] })
  notifyMemberList: NotifyMemberList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
