import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostTgMsgReq {
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

export class PostTgMsgResp {
  @ApiProperty({
    title: '傳送結果'
  })
  @IsString()
  result: string;
}