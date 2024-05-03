import { ApiProperty } from '@nestjs/swagger';

export class DownloadRewardSendExampleResp {
  @ApiProperty({
    title: 'Excel buffer',
    example: '1',
    description: 'Excel buffer'
  })
  buffer: ArrayBuffer;
}
