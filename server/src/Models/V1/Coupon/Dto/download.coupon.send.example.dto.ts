import { ApiProperty } from '@nestjs/swagger';

export class DownloadCouponSendExampleResp {
  @ApiProperty({
    title: 'Excel buffer',
    example: '1',
    description: 'Excel buffer'
  })
  buffer: ArrayBuffer;
}
