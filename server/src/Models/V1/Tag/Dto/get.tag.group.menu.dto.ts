import { ApiProperty } from '@nestjs/swagger';

export class GetTagGroupMenuResp {
  @ApiProperty({
    title: '標籤分類編號',
    example: '1',
    description: '標籤分類編號'
  })
  id: number;

  @ApiProperty({
    title: '標籤分類名稱',
    example: '1',
    description: '標籤分類名稱'
  })
  name: string;
}
