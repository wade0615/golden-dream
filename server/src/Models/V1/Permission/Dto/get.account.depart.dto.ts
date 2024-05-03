import { ApiProperty } from '@nestjs/swagger';

export class Store {
  @ApiProperty({
    title: '門市id'
  })
  storeId: string;

  @ApiProperty({
    title: '門市名稱'
  })
  storeName: string;
}
export class Depart {
  @ApiProperty({
    title: '品牌id'
  })
  brandId: string;

  @ApiProperty({
    title: '品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '',
    type: [Store]
  })
  store: Store[];
}

export class GetAccountDepartResp {
  @ApiProperty({
    title: '門市id',
    type: [Depart]
  })
  depart: Depart[];
}
