import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdChannelDetailDto {
  @ApiProperty({
    title: '渠道列表',
    description: '渠道列表資料',
    required: true
  })
  @IsNotEmpty()
  channelList: ChannelList[];

  iam: IamDto;
}

class ChannelList {
  @ApiProperty({
    title: '渠道編號',
    example: 'Ch0000',
    description: '渠道編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({
    title: '會籍/積點計算訂單',
    example: 'true',
    description: '會籍/積點計算訂單',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  pointCalculation: boolean;

  @ApiProperty({
    title: '品牌編號',
    examples: ['CD', 'CX'],
    description: '品牌編號資料',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  brandIds: string[];
}
