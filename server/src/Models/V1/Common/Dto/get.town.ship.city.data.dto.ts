export interface GetTownshipCityDataResp {
  township: Township[];
}

interface Township {
  cityCode: string;
  cityName: string;
  zips: ZipsResp[];
}
interface ZipsResp {
  zipCode: string;
  zipName: string;
}
