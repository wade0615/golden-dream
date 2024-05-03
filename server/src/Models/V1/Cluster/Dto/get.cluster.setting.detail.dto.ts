export class GetClusterSettingDetailDto {
  clusterId: string;
}

export class NotifyGroupData {
  seq: number;
  name: string;
}

export class GetClusterSettingDetailResp {
  clusterName: string;
  clusterDescription: string;
  exportStatus: string;
  exportStartDate: string;
  exportEndDate: string;
  monthEvery: number;
  exportDataType: string;
  positiveData: any;
  negativeData: any;
  exportParamsKey: string[];
  notifyGroupData: NotifyGroupData[];
}
