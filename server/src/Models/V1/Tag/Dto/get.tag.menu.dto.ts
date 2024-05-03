import { ApiProperty } from '@nestjs/swagger';

export class GetTagMenuResp {
  @ApiProperty({
    title: '標籤編號',
    example: '1',
    description: '標籤編號'
  })
  id: number;

  @ApiProperty({
    title: '標籤名稱',
    example: '1',
    description: '標籤名稱'
  })
  name: string;
}
