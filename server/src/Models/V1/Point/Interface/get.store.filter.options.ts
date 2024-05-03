import { GetTownshipCityDataResp } from '../../Common/Dto/get.town.ship.city.data.dto';
import { Brand } from './get.store.filter.options.form.db';

export class GetStoreFilterOptionResp {
  cityAndZip: GetTownshipCityDataResp;
  mall: string[];
  brand: Brand[];
}
