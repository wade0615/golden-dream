import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDataCommon } from 'src/Definition/Dto/common';

export class GetMemberShipLogDto {
  @ApiProperty({
    title: '會員編號',
    example: 'M00000001',
    description: '長度為10的會員編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

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

export class LogList {
  @ApiProperty({
    title: '會籍',
    example: '星卡'
  })
  memberShipName: string;

  @ApiProperty({
    title: '項目',
    example: '降等'
  })
  actionType: string;

  @ApiProperty({
    title: '起始日',
    example: '2023/02/02 00:00:00'
  })
  startDate: string;

  @ApiProperty({
    title: '到期日',
    example: '2023/02/02 00:00:00'
  })
  endDate: string;

  @ApiProperty({
    title: '系統異動日',
    example: '2023/02/02 00:00:00'
  })
  createTime: string;
}

export class BillInfo {
  @ApiProperty({
    title: 'wording'
  })
  text: string;

  @ApiProperty({
    title: '數字',
    example: 20
  })
  number: number | string;
}

export class GetMemberShipLogResp {
  @ApiProperty({ type: [LogList] })
  logList: LogList[];

  @ApiProperty({ type: BillInfo })
  billInfo: BillInfo[];

  @ApiProperty({ type: MetaDataCommon })
  metaData: MetaDataCommon;
}
