export interface SendRegisterCouponReq {
  memberId: string;
  couponId: string;
  sendId: string;
  redeemId: string;
  transactionId: string;
  status: number;
  expiredDate: string;
}
