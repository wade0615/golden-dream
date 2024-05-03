import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class UpdateActiveMemberShipDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '會籍通用設定編號',
    example: 'M004',
    description: '會籍通用設定編號',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  settingId: string;

  @ApiPropertyOptional({
    title: '單筆會籍編號',
    example: 'M00401',
    description: '單筆會籍編號',
    required: false
  })
  @IsOptional()
  @IsString()
  memberShipId: string;

  @ApiProperty({
    title: '升等禮',
    example: ['C2308090006'],
    description: '發放規則為升等禮的兌換券 ID',
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  upgradeCouponIds: string[];

  @ApiProperty({
    title: '續會禮',
    example: ['C2308090007'],
    description: '發放規則為續會禮的兌換券 ID',
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  renewalCouponIds: string[];
}

export class AddMemberShipResp {
  memberShipId: string;
}
