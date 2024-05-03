import { ApiProperty } from '@nestjs/swagger';
import { MenuCommon } from 'src/Definition/Dto/common';

export class GetNotifyClassMenuResp {
  @ApiProperty({ type: [MenuCommon] })
  list: MenuCommon[];
}
