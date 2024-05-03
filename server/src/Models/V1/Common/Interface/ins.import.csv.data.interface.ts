export interface InsImportCsvDataReq {
  tableName: string;
  columnDetails: string[];
  insColumns: string[];
  insValue: string[];
}
