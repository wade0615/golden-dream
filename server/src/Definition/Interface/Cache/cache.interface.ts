import { GetMemberAuthPermissionResp } from '../AuthDao/get.member.auth.permission.interface';

export interface CacheUserInfo {
  authMemberId: string;
  name: string;
  account: string;
  password: string;
  token: string;
  isAdmin: boolean;
  authPermission: GetMemberAuthPermissionResp[];
  homePage: string;
}

export interface CacheRefreshInfo {
  memberId: string;
  name: string;
  account: string;
  token: string;
  homePage: string;
}
