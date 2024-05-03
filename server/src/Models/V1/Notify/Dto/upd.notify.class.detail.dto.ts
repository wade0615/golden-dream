import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdNotifyClassDetailDto {
  @ApiProperty({
    title: '通知人員流水號',
    example: '1',
    description: '依照通知人員表設定，帶入空值代表新增',
    required: false
  })
  @IsNumber()
  @IsOptional()
  notifySeq: number;

  @ApiProperty({
    title: '通知分類名稱',
    example: '分類01',
    description: '依照通知分類表設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  groupName: string;

  iam: IamDto;
}
