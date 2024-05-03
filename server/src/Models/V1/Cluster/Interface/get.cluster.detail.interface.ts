export interface GetClusterDetail {
  clusterName: string;
  clusterDescription: string;
  exportStatus: string;
  exportStartDate: string;
  exportEndDate: string;
  monthEvery: number;
  exportDataType: string;
  peopleCount: number;
}
