import { ApiProperty } from '@nestjs/swagger';
import { MenuIdCommon } from 'src/Definition/Dto/common';

export class GetChannelMenuResp {
  @ApiProperty({ type: [MenuIdCommon] })
  list: MenuIdCommon[];
}
