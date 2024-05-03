import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetAccountListDto {
  @ApiProperty({
    title: '搜尋欄',
    example: '',
    description: '模糊搜尋 帳號/名稱/品牌名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    title: '搜尋欄指定條件',
    example: 'account',
    description: 'account: 帳號/member_name: 名稱/brand_name: 品牌名稱',
    required: false
  })
  @IsString()
  @IsOptional()
  searchType: string;

  @ApiProperty({
    title: '角色id',
    example: '1',
    description: '根據會籍管理設定資料',
    required: false
  })
  @IsString()
  @IsOptional()
  roleId: string;

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

export class DepartList {
  @ApiProperty({
    title: '事業部id'
  })
  brandId: string;

  @ApiProperty({
    title: '事業部名稱'
  })
  brandName: string;
}

export class AuthMemberList {
  @ApiProperty({
    title: '後台auth member id',
    default: 'test1234'
  })
  authMemberId: string;

  @ApiProperty({
    title: '使用者名稱'
  })
  authName: string;

  @ApiProperty({
    title: '帳號',
    default: 'tommy'
  })
  account: string;

  @ApiProperty({
    title: '建立時間'
  })
  createDate: string;

  @ApiProperty({
    title: '修改人員',
    default: 'M00000002',
    description: '更新會員的人員編號'
  })
  alterName: string;

  @ApiProperty({
    title: '修改日期',
    default: '2023-06-26T15:03:38.000Z',
    description: '更新會員的時間'
  })
  alterDate: string;

  @ApiProperty({ type: [DepartList] })
  departList: DepartList[];
}

export class GetAccountListResp {
  @ApiProperty({ type: [AuthMemberList] })
  memberList: AuthMemberList[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
