export class NotifyExcelData {
  id: string;
  mobileCountryCode: string;
  mobile: string;
}

export interface ChkUploadNotifyMobileExcelResp {
  excelData: NotifyExcelData[];
}
