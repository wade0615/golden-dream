export class InsertEventDto {
  event: string;
  memberId: string;
  email: string;
  mobile: string;
}

export class InsertEventResp {
  Event: string;
  Member_ID: string;
  Send_Timing: string;
  Send_Time: string;
  Mobile: string;
  Email: string;
  Email_Title?: string;
  Email_Content?: string;
  Push_State?: string;
  Sms_State?: string;
  Action_State?: string;
}
