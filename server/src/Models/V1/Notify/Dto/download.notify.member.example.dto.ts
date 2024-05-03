import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotifyMemberTypeDto {
  @ApiProperty({
    title: '範本類型',
    example: 'ADD',
    description: 'ADD: 新增; DEL: 移除',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class DownloadNotifyMemberExampleResp {
  @ApiProperty({
    title: 'Excel buffer',
    example: '1',
    description: 'Excel buffer'
  })
  buffer: ArrayBuffer;
}
