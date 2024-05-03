export interface AllCsvData<T> {
  fileName: string;
  filePassword: string;
  csvColumn: string[];
  datas: Array<T>;
}
