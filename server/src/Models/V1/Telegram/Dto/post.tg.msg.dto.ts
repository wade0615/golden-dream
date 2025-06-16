import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostTgMsgDto {
  @ApiProperty({
    title: '稱呼'
  })
  @IsString()
  name: string;

  @ApiProperty({
    title: '訊息'
  })
  @IsString()
  msg: string;
}
