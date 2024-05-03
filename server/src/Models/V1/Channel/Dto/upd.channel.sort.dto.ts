import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdChannelSortDto {
  @ApiProperty({
    title: '渠道排序',
    examples: ['Ch0000', 'Ch0001'],
    description: '渠道排序資料',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  channelRanks: string[];

  iam: IamDto;
}
