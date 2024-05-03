export interface GetMemberDetailDaoResp {
  id: string;
  name: string;
  cardNumber: string;
  birthday: string;
  gender: string;
  gmail: string;
  recommenderMemberId: string;
  createTime: string;
  referralCode: string;
  cityCode: string;
  zipCode: string;
  address: string;
  homePhone: string;
  carriersKey: string;
  remark: string;
  mobile: string;
  mobileCountryCode: string;
  membershipStatus: string;
  spacialType: number;
}

export interface additional {
  col?: string;
  emptyMember?: string;
  repeatMember?: string;
  date?: string;
}
