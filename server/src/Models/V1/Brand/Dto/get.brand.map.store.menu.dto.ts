import { ApiProperty } from '@nestjs/swagger';
import { MenuIdCommon } from 'src/Definition/Dto';

export class GetBrandMapStoreMenuResp {
  @ApiProperty({
    title: '品牌編號',
    example: 'TT',
    description: '品牌編號'
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱',
    example: '旭集',
    description: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '是否為集團店',
    example: 'true',
    description: '集團店狀態，true: 是 false: 否'
  })
  isCorporation: boolean;

  @ApiProperty({ type: [MenuIdCommon] })
  stores: MenuIdCommon[];
}
