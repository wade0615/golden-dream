import { ApiProperty } from '@nestjs/swagger';

export class DownloadTagDataResp {
  @ApiProperty({
    title: 'Excel buffer',
    example: '1',
    description: 'Excel buffer'
  })
  buffer: ArrayBuffer;
}
