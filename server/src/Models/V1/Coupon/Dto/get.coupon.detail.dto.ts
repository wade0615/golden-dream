export class GetCouponDetailDto {
  couponId: string;
}

export class GetCouponDetailResp {
  isTransferable: boolean;
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
