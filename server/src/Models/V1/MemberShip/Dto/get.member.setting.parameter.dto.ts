import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberSettingParameterDto {
  @ApiProperty({
    title: '會籍通用設定編號',
    example: 'M004',
    description: '會籍通用設定編號',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  settingId: string;
}

export interface GetBasicSettingFromDBResp {
  channelName: string;
  fullDate: string;
}

export interface GetMemberShipListResp {
  memberShipId: string;
  memberShipName: string;
  nextMemberShip: string;
}

export interface ValueLable {
  label: string;
  value: string;
}

export interface GetMemberSettingParameterResp {
  setting: GetBasicSettingFromDBResp[];
  memberShipList: ValueLable[];
}
