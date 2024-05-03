import { Injectable } from '@nestjs/common';
import { ORDER_BY_TYPE } from 'src/Definition';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import {
  GetHolidaySettingListDto,
  HolidaySettingList
} from './Dto/get.holiday.list.dto';
import { AddHolidayDetailReq } from './Interface/add.holiday.detail.interface';

@Injectable()
export class HolidayRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得假日設定列表
   *
   * @param req
   * @returns
   */
  async getHolidaySettingList(
    req: GetHolidaySettingListDto
  ): Promise<HolidaySettingList[]> {
    const _year = this.internalConn.escape(req?.year);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    const _orderByType =
      req?.orderByType === ORDER_BY_TYPE.DESC
        ? ORDER_BY_TYPE.DESC
        : ORDER_BY_TYPE.ASC;

    let sqlStr = `
    SELECT
      Holiday_Date as date,
      Holiday_Week as week,
      Holiday_Remark as remark
    FROM
      Holiday_Setting
    WHERE Is_Active = 1
      AND Holiday_Year = ${_year}
    `;

    sqlStr += ` ORDER BY Holiday_Date ${_orderByType}`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得假日設定列表總筆數
   *
   * @param req
   * @returns
   */
  async getHolidaySettingListCount(
    req: GetHolidaySettingListDto
  ): Promise<number> {
    const _year = this.internalConn.escape(req?.year);

    const sqlStr = `
    SELECT
      COUNT(*) as holidayCount
    FROM
      Holiday_Setting
    WHERE Is_Active = 1
      AND Holiday_Year = ${_year}
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.holidayCount;
  }

  /**
   * 刪除假日設定資料
   *
   * @param connection BD 連線
   * @param year 日曆年度
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delHolidayDetail(
    connection,
    year: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Holiday_Setting SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Holiday_Year = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      year
    ]);

    return {};
  }

  /**
   * 新增假日設定資料
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insHolidayDetail(
    connection,
    req: AddHolidayDetailReq[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _authMemberId = this.internalConn.escape(authMemberId);

    let sqlStr = `
    INSERT INTO Holiday_Setting
    (Holiday_Year, Holiday_Date, Holiday_Week, Holiday_Remark, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    for (const detail of req) {
      const _year = this.internalConn.escape(detail.year);
      const _date = this.internalConn.escape(detail.date);
      const _week = this.internalConn.escape(detail.week);
      const _remark = this.internalConn.escape(detail.remark);

      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += ` (${_year}, ${_date}, ${_week}, ${_remark}, ${_authMemberId}, ${_authMemberId})`;
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Holiday_Week = VALUES(Holiday_Week), Holiday_Remark = VALUES(Holiday_Remark),`;
    sqlStr += ` Alter_ID = VALUES(Alter_ID), Alter_Date = CURRENT_TIMESTAMP, Is_Active = 1`;

    await this.internalConn.transactionQuery(connection, sqlStr, []);

    return {};
  }
}
