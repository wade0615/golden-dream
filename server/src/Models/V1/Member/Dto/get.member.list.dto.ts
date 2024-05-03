import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetMemberListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '0912345678',
    description: '手機/姓名/卡號',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'mobile',
    description: 'mobile: 手機/member_name: 姓名/member_card: 卡號',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '開始日期',
    example: '2023/06/19 12:00:00',
    description: '註冊開始時間',
    required: false
  })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty({
    title: '結束日期',
    example: '2023/06/19 13:00:00',
    description: '註冊結束時間',
    required: false
  })
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    title: '特殊會員類型',
    example: '1',
    description: '根據特殊會員設定資料',
    required: false
  })
  @IsNumber()
  @IsOptional()
  memberSpecialType: number;

  @ApiProperty({
    title: '會籍類型',
    example: '1',
    description: '根據會籍管理設定資料',
    required: false
  })
  @IsString()
  @IsOptional()
  membershipStatus: string;

  @ApiProperty({
    title: '會員編號',
    examples: ['M00000001'],
    description: '長度為10的會員編號',
    required: true
  })
  @IsArray()
  @IsOptional()
  memberIds: string[];

  @ApiProperty({
    title: '頁數',
    default: '1',
    description: '當前頁數',
    required: false
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '一頁筆數',
    default: '20',
    description: '每頁幾筆',
    required: false
  })
  @IsNumber()
  @IsOptional()
  perPage: number;
}

export class MemberList {
  @ApiProperty({
    title: '會員id',
    example: 'test1234',
    description: 'Member ID'
  })
  memberId: string;

  @ApiProperty({
    title: '會員卡號',
    example: 'i230000123'
  })
  memberCardId: string;

  @ApiProperty({
    title: '會員姓名',
    example: 'tommy'
  })
  memberName: string;

  @ApiProperty({
    title: '手機號碼（國碼）',
    example: '+886'
  })
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    example: '0900000123',
    description: '0900000123'
  })
  phone: string;

  @ApiProperty({
    title: '生日',
    example: '2023-09-02',
    description: ''
  })
  birthday: string;

  @ApiProperty({
    title: '註冊時間',
    example: '2023-06-26T15:03:38.000Z'
  })
  registerTime: string;

  @ApiProperty({
    title: '會籍類型',
    example: '1',
    description: '根據會籍管理設定資料'
  })
  membershipStatus: string;

  @ApiProperty({
    title: '會員是否已刪除',
    example: '1',
    description: '1：已刪除; 0：未刪除'
  })
  isDelete: number;

  @ApiProperty({
    title: '修改人員',
    example: 'M00000002',
    description: '更新會員的人員編號'
  })
  alterName: string;

  @ApiProperty({
    title: '修改日期',
    example: '2023-06-26T15:03:38.000Z',
    description: '更新會員的時間'
  })
  alterTime: string;
}

export class GetMemberListResp {
  @ApiProperty({ type: [MemberList] })
  memberList: MemberList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
