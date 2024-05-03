import moment = require('moment-timezone');

export class RoleEntity {
  Role_ID: string;
  Permission_Code: string;
  Role_Name: string;
  Role_Description: string;
  Role_State: string;
  Sort_Order: string;
  Is_Active: number;
  Create_ID: string;
  Alter_Date: string;
  Alter_ID: string;

  constructor(body) {
    this.Role_ID = body?.roleId;
    this.Role_Name = body?.paymentId;
    this.Role_Description = body?.description;
    this.Role_State = body?.paymentId;
    this.Create_ID = body?.iam?.authMemberId ?? '';
    this.Alter_ID = body?.iam?.authMemberId ?? '';
  }
  insertEntity() {
    return {
      Role_ID: this.Role_ID,
      Role_Name: this.Role_Name,
      Role_State: 1,
      Sort_Order: this.Sort_Order,
      Create_ID: this.Create_ID,
      Alter_ID: this.Alter_ID
    };
  }

  updateEntity() {
    return {
      Role_ID: this.Role_ID,
      Role_Name: this.Role_Name,
      Role_State: 1,
      Sort_Order: this.Sort_Order,
      Create_ID: this.Create_ID,
      Alter_ID: this.Alter_ID,
      Alter_Date: moment().utc().format('YYYY-MM-DD HH:mm:ss')
    };
  }

  deleteEntity() {
    return {
      ID: this.Role_ID,
      IS_Active: 0,
      Alter_ID: this.Alter_ID
    };
  }
}
