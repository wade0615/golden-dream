import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class GiftDetails {
  @ApiProperty({
    title: '渠道 ID',
    example: 'Ch0001',
    description: '渠道管理編號',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  channelId: string;

  @ApiProperty({
    title: '兌換券 ID',
    examples: ['C2308090001', 'C2308090002'],
    description: '兌換券管理編號',
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  couponIds: string[];
}

export class UpdateActiveMemberShipSettingDto extends PartialType(
  IamObjectDto
) {
  @ApiPropertyOptional({
    title: '會籍通用設定編號',
    example: 'M004',
    description: '會籍通用設定編號',
    required: false
  })
  @IsNotEmpty()
  @IsString()
  settingId: string;

  @ApiPropertyOptional({ type: [GiftDetails] })
  gift: GiftDetails[];
}

export class AddMemberShipSettingResp {
  settingId: string;
}
