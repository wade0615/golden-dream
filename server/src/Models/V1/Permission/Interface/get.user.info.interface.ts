export class GetAuthMemberListInterface {
  authMemberId: string;
  authName: string;
  account: string;
  state: boolean;
  createDate: string;
  createName: string;
  alterDate: string;
  alterName: string;
  lastLoginDate: string;
  length: number;
  roleName: string;
  departList: Brand[];
}

export interface Brand {
  brandId: string;
  brandName: string;
}

export class GetMemberDetail {
  authMemberId: string;
  name: string;
  account: string;
  email: string;
  state: boolean;
  remark: string;
  createDate: string;
  createName: string;
  alterDate: string;
  alterName: string;
  lastLoginDate: string;
}

export class GetMemDepartInfo {
  departId: string;
  storeName: string;
  storeId: string;
  brandName: string;
  brandId: string;
}

export class GetMemRoleInfo {
  roleId: string;
  roleName: string;
}
