import { ApiProperty } from '@nestjs/swagger';

export class DownloadMemberSpecialTypeExampleResp {
  @ApiProperty({
    title: 'Excel buffer',
    example: '1',
    description: 'Excel buffer',
  })
  buffer: ArrayBuffer;
}
