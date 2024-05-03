import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class DelMemberShipSettingDto extends PartialType(IamObjectDto) {
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
