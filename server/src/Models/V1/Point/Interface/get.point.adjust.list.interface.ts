export class GetPointAdjustListResp {
  adjustList: AdjustList[];
}

export interface AdjustList {
  adjustId: string;
  adjustName: string;
  status: number;
  memberType: string;
  adjustType: string;
  adjustPoint: string | number;
  adjustDate: string;
  createDate: string;
  createId: string;
  modifyDate: string;
  modifyId: string;
}
