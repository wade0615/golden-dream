export interface SendSmsReq {
  mobile: string;
  message: string;
}

export class SendSmsResp {
  return: string;
  msg: string;
}
