export class GetCouponSearchDto {
  memberShipId: string;
  channelPwd: string;
  brandIds: string[];
  birthdayYear: string;
  birthdayMonth: string;
  page: number;
  perPage: number;
}

export class CouponSearch {
  couponId: string;
  brandIds: string[];
  couponName: string;
  point: number;
  startDate: string;
  endDate: string;
  mainImageUrl: string;
  thumbnailImageUrl: string;
  couponStartDate: string;
  couponEndDate: string;
  releaseStatue: number;
  releaseDate: string;
  content: string;
  alterTime: string;
}

export class GetCouponSearchResp {
  couponSearch: CouponSearch[];
  next: number;
}
