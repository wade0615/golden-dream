import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelNotifyClassDto {
  @ApiProperty({
    title: '通知分類 ID',
    example: '1',
    description: '依據通知分類設定列表',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  notifyId: number;

  iam: IamDto;
}
