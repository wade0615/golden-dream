import moment = require('moment-timezone');

export class PermissionEntity {
  Permission_ID: string;
  Permission_Code: string;
  Permission_Name: string;
  Permission_Type: string;
  Permission_Path: string;
  Dependence: string;
  Is_Active: number;
  Create_ID: string;
  Alter_Date: string;
  Alter_ID: string;

  constructor(body) {
    this.Permission_ID = body?.id;
    this.Permission_Code = body?.paymentName;
    this.Permission_Name = body?.paymentId;
    this.Permission_Type = body?.paymentId;
    this.Permission_Path = body?.paymentId;
    this.Dependence = body?.paymentId;
    this.Create_ID = body?.iam?.authMemberId ?? '';
    this.Alter_ID = body?.iam?.authMemberId ?? '';
  }
}
