import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import {
  GetReportExportListDto,
  ReportExportList
} from './Dto/get.report.export.list.dto';
import { GetReportExportDetailResp } from './Interface/get.report.export.detail.interface';

import moment = require('moment-timezone');

/**
 * 報表
 *
 * @class
 */
@Injectable()
export class ReportRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得報表匯出列表
   *
   * @param req
   * @returns
   */
  async getReportExportList(
    req: GetReportExportListDto
  ): Promise<ReportExportList[]> {
    let sqlStr = `
    SELECT
      ID as exportId,
      File_Name as fileName,
      Create_Date as createTime
    FROM
      Export_Csv_Log
    WHERE Csv_Type = ?
    `;
    const params = [];
    params.push(req?.action);

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.DATA_YEAR:
          sqlStr += ` AND JSON_EXTRACT(Req_Json, '$.exportYear') = ?`;
          params.push(req?.search);
          break;
      }
    }

    sqlStr += ` ORDER BY Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得報表匯出列表總筆數
   *
   * @param req
   * @returns
   */
  async getReportExportListCount(req: GetReportExportListDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(ID) as exportIdCount
    FROM
      Export_Csv_Log
    WHERE Csv_Type = ?
    `;
    const params = [];
    params.push(req?.action);

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.DATA_YEAR:
          sqlStr += ` AND JSON_EXTRACT(Req_Json, '$.exportYear') = ?`;
          params.push(req?.search);
          break;
      }
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.exportIdCount;
  }

  /**
   * 取得報表匯出詳細資料
   *
   * @param exportId
   * @returns
   */
  async getReportExportDetail(
    exportId: string
  ): Promise<GetReportExportDetailResp> {
    const sqlStr = `
    SELECT
      Csv_Type as csvType,
      File_Name as fileName,
      File_Url as url
    FROM
      Export_Csv_Log
    WHERE ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [exportId]);

    return result?.[0];
  }
}
