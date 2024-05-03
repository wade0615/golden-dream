import moment = require('moment-timezone');

export class PaymentEntity {
  ID: number;
  Payment_Name: string;
  Payment_ID: any;
  Create_ID: string;
  Alter_ID: string;

  constructor(body) {
    this.ID = body.id;
    this.Payment_Name = body.paymentName;
    this.Payment_ID = body.paymentId;
    this.Create_ID = body.iam.authMemberId ?? '';
    this.Alter_ID = body.iam.authMemberId ?? '';
  }

  insertEntity() {
    return {
      Payment_Name: this.Payment_Name,
      Payment_ID: this.Payment_ID,
      Create_ID: this.Create_ID,
      Alter_ID: this.Alter_ID
    };
  }

  updateEntity() {
    return {
      ID: this.ID,
      Payment_Name: this.Payment_Name,
      Payment_ID: this.Payment_ID,
      Alter_ID: this.Alter_ID ?? '',
      Alter_Date: moment().utc().format('YYYY-MM-DD HH:mm:ss')
    };
  }

  deleteEntity() {
    return {
      ID: this.ID,
      IS_Active: 0,
      Alter_ID: this.Alter_ID
    };
  }
}
