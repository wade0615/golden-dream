import { PartialType } from '@nestjs/swagger';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class ReplaceableProduct {
  commodity_id: string;
  commodity_name: string;
  remark: string;
}

export class ComboDetail {
  commodity_id: string;
  commodity_name: string;
  remark: string;
  replaceable_products: ReplaceableProduct[];
}

export class CommodityDetail {
  brand_id: string;
  store_id: string;
  commodity_id: string;
  commodity_name: string;
  commodity_type: string;
  status: string;
  combo: ComboDetail[];
}

export class AddCommodityDetailDto extends PartialType(IamObjectDto) {
  methods: string;
  channelPwd: string;
  commodityDetail: CommodityDetail[];
}
