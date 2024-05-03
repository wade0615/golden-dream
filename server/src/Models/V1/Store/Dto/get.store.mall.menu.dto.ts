import { ApiProperty } from '@nestjs/swagger';

export class GetStoreMallMenuResp {
  @ApiProperty({
    title: '商場名稱',
    examples: ['商場名稱1', '商場名稱2'],
    description: '商場名稱',
  })
  mallNames: string[];
}
