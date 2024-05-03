export interface GetMemberPointResp {
  point: number;
  expiredDate: string;
  cardId: string;
  name: string;
  mobileCountryCode: string;
  mobile: string;
}

export interface UsedPoint {
  memberId: string;
  point: number;
  expiredDate: string;
}

export interface MemberPointLog {
  Member_ID: string;
  Card_ID: string;
  Member_Name: string;
  Mobile_Country_Code: string;
  Mobile: string;
  Point_Type: string;
  Point_Type_Str: string;
  Point_Item: string;
  Point: number;
  Order_ID: string;
}
