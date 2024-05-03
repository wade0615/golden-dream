export class GetAuthItemsResp {
  authItem: AuthItem[];
}

export class AuthItem {
  systemType: string;
  systemTypeStr: string;
  permissions: Permissions[];
}

export class Permissions {
  id: string;
  name: string;
  child?: Permissions[];
}
