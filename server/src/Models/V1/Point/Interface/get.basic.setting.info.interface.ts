export class GetBasicSettingInfoResp {
  pointId: string;
  pointName: string;
  pointRatio: number;
  expiryYear: number;
  expiryMonth: number;
  expiryDate: number;
  channel: Channel[];
}

export interface Channel {
  channelId: string;
  channelName: string;
  fullDate: number;
}
