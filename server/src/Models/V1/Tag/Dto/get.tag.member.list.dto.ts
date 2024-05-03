import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto';

export class GetTagMemberListDto {
  @ApiProperty({
    title: '貼標行為',
    example: 'ADD',
    description: 'ADD：新增; DEL：刪除',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  action: string;

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

export class TagMemberList {
  @ApiProperty({
    title: '標籤上傳編號',
    example: '1',
    description: '標籤上傳編號'
  })
  tagUploadLogId: number;

  @ApiProperty({
    title: '標籤名稱',
    example: '標籤01',
    description: '標籤名稱'
  })
  tagName: string;

  @ApiProperty({
    title: '貼標人數',
    example: '10',
    description: '貼標人數'
  })
  tagMemberCount: number;

  @ApiProperty({
    title: '指定會員 Csv',
    example: 'https://localhost/',
    description: 'Csv Url'
  })
  url: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023/06/19 17:27:37',
    description: '貼標的時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wei',
    description: '貼標的角色'
  })
  createName: string;
}

export class GetTagMemberListResp {
  @ApiProperty({ type: [TagMemberList] })
  tagMemberList: TagMemberList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
