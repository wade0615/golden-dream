import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdNotifyClassRankDto {
  @ApiProperty({
    title: '修改通知分類設定',
    examples: ['TT', 'TX'],
    description: '修改通知分類設定',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  notifySorts: number[];

  iam: IamDto;
}
