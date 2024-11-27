import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../../../Providers/Database/DatabaseMysql/mysql.provider';
import { InsImportCsvDataReq } from './Interface/ins.import.csv.data.interface';

@Injectable()
export class CommonRepository {
  constructor(private internalConn: MysqlProvider) {}
  /**
   * mysql: 通用 insert, data by object key insert. | value === 'd' 支持 null
   * @param tableName
   * @param data
   */
  async _insert(tName, _data) {
    try {
      // remove null att.
      let data = {};
      Object.keys(_data).forEach((key) => {
        // console.log(key, ':', _data[key]);
        if (_data[key]) data[key] = _data[key];
        if (_data[key] === 'd') data[key] = null;
      });

      let sqlC = `INSERT INTO ${tName}`;
      sqlC += ` (`;
      Object.keys(data).forEach((key, index) => {
        sqlC +=
          Object.keys(data).length !== Number(index) + 1
            ? `${key}, `
            : `${key}`;
      });
      sqlC += ' ) VALUES( ';
      Object.keys(data).forEach((key, index) => {
        sqlC +=
          Object.keys(data).length !== Number(index) + 1
            ? `${escape(data[key])}, `
            : `${escape(data[key])}`;
        // ? `$${index + 1}, `
        // : `$${index + 1}`;
      });
      sqlC += ' );';

      // console.log('_insert sql:', sqlC);

      const result = await this.internalConn.query(sqlC, []);
      return result;
    } catch (error) {
      throw Error(`[insert][error]: ${error.message}`);
    }
  }

  /**qz
   * mysql: update by key = value, one condition. | value === 'd' 支持 null
   * @param tName
   * @param key
   * @param value
   * @param _data
   * @param db
   * @returns
   */
  async _update_by_keys(tName, wKeys, wValues, _data) {
    try {
      if (
        !Array.isArray(wKeys) ||
        !Array.isArray(wValues) ||
        wKeys.length !== wValues.length
      )
        throw Error('key-value pair not matched');

      let data = {};
      Object.keys(_data).forEach((key) => {
        if (_data[key]) data[key] = _data[key];
        if (_data[key] === 'd') data[key] = null;
      });

      let sqlC = `update ${tName} set `;

      Object.keys(data).forEach((key, index) => {
        sqlC +=
          Object.keys(data).length !== Number(index) + 1
            ? `${key} = ${this.internalConn.escape(data[key])}, `
            : `${key} = ${this.internalConn.escape(data[key])}`;
      });

      wKeys.forEach((key, index) => {
        if (index === 0)
          sqlC += `  where ${key} = ${this.internalConn.escape(
            wValues[index]
          )}`;
        if (index !== 0)
          sqlC += `  and ${key} = ${this.internalConn.escape(wValues[index])}`;
      });

      // console.log('sqlC:', sqlC);

      const result = await this.internalConn.query(sqlC, []);
      return result;
    } catch (error) {
      throw Error(`[update][error]: ${error.message}`);
    }
  }

  /**
   * mysql: _delete_by_keys
   * @param tName
   * @param wKeys
   * @param wValues
   * @returns
   */
  async _delete_by_keys(tName, wKeys, wValues) {
    try {
      if (
        !Array.isArray(wKeys) ||
        !Array.isArray(wValues) ||
        wKeys.length !== wValues.length
      )
        throw Error('key-value pair not matched');

      let sqlC = `delete from ${tName} `;
      wKeys.forEach((key, index) => {
        if (index === 0) sqlC += `  where ${key} = '${wValues[index]}'`;
        if (index !== 0) sqlC += `  and ${key} = '${wValues[index]}'`;
      });

      const result = await this.internalConn.query(sqlC, []);
      return result;
    } catch (error) {
      throw Error(`[delete][error]: ${error.message}`);
    }
  }

  /**
   * mysql: _select_by_keys
   * @param tName
   * @param wKeys
   * @param wValues
   * @returns
   */
  async _select_by_keys(tName: string, wKeys, wValues) {
    console.debug('wKeys:', wKeys, tName, wValues);
    try {
      if (
        !Array.isArray(wKeys) ||
        !Array.isArray(wValues) ||
        wKeys.length !== wValues.length
      ) {
        throw Error('key-value pair not matched');
      }

      let sqlC = `select * from ${tName} `;
      wKeys.forEach((key, index) => {
        if (index === 0) sqlC += ` where ${key} = '${wValues[index]}'`;
        if (index !== 0) sqlC += ` and ${key} = '${wValues[index]}'`;
      });
      const result = await this.internalConn.query(sqlC, []);

      return result;
    } catch (error) {
      throw Error(`[select][error]: ${error.message}`);
    }
  }

  /**
   * 取得參數名稱
   *
   * @param code
   * @returns
   */
  async getCodCenterCodeName(belongTo: string, code: string): Promise<string> {
    const sqlStr = `
    SELECT
      Code_Name as codeName
    FROM
      Code_Center
    WHERE Belong_To = ?
      AND Code = ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [belongTo, code])) ?? [];

    return result?.[0]?.codeName;
  }

  /**
   * 取得參數列表
   * @param code
   * @returns
   */
  async getCodeCenterList(): Promise<string[]> {
    const sqlStr = `
    SELECT
      Code as code,
      Code_Name as codeName,
      Description as description,
      Belong_To as belongTo,
      Previous_Code as previousCode
    FROM
      Code_Center
    ORDER BY Create_Time
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 新增檔案詳情資料
   *
   * @param relationId 檔案編號
   * @param filesType
   * @param url
   * @returns
   */
  async insFilesDetail(
    relationId: string,
    filesType: string,
    url: string
  ): Promise<Record<string, never>> {
    const addData = {
      Relation_ID: relationId,
      Files_Type: filesType,
      Url: url,
      Create_ID: 'system',
      Alter_ID: 'system'
    };

    const sqlStr = `
    INSERT INTO Files SET ?
    `;

    await this.internalConn.query(sqlStr, [addData]);

    return {};
  }

  /**
   * 依照 url 取得圖片編號
   *
   * @param type
   * @param url
   * @returns
   */
  async getFilesDetail(type: string, url: string): Promise<String> {
    const sqlStr = `
    SELECT
      Relation_ID as relationId
    FROM Files
    WHERE Is_Active = 1
      AND Files_Type = ?
      AND Url = ?
    `;

    const result = await this.internalConn.query(sqlStr, [type, url]);

    return result?.[0]?.relationId;
  }

  /**
   * 取得存在的 table
   * @param tableNames
   * @returns
   */
  async getExistedTable(tableNames: string[]): Promise<string[]> {
    if (!tableNames.length) return [];

    const queryStr = /* sql */ `
  SELECT TABLE_NAME tableName
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = 'iEat_CRM' AND TABLE_NAME IN (?)`;

    const result =
      (await this.internalConn.query(queryStr, [tableNames]))?.map(
        (x) => x?.tableName
      ) ?? [];

    return result;
  }

  /**
   * 新增匯出事件至 DB
   * @param csvType 匯出類型
   * @param memberId 點擊的會員
   * @param fileName csv檔案名稱
   * @param reqJson 生成資料需要的 req
   */
  async insertExportEvent(
    id: string,
    csvType: string,
    memberId: string,
    fileName: string,
    reqJson: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
SET @email = (SELECT Email FROM Auth_Member WHERE Auth_Member_ID = ?);

INSERT INTO Export_Csv_Log
(ID, Csv_Type, Auth_Member_ID, Email, Req_Json, Create_ID, File_Name)
VALUES(?,?,?, @email,?,?,?);
`;

    await this.internalConn.query(queryStr, [
      memberId,
      id,
      csvType,
      memberId,
      reqJson,
      memberId,
      fileName
    ]);

    return {};
  }

  /**
   * 取得匯出表 ID 最大值
   * @returns
   */
  async getMaxExportId(): Promise<string> {
    const queryStr = /* sql */ `
        SELECT MAX(ID) id FROM Export_Csv_Log LIMIT 1
        `;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0]?.id;
  }

  /**
   * 新增匯入 Csv 資料
   *
   * @param tableName
   * @param req
   * @returns
   */
  async insImportCsvData(
    req: InsImportCsvDataReq
  ): Promise<Record<string, never>> {
    const sqlStr = `
    CREATE TABLE ${req?.tableName} (${req?.columnDetails?.join(',')});

    INSERT INTO ${req?.tableName}
    (${req?.insColumns?.join(',')})
    VALUES
    ${req?.insValue?.join(',')}
    `;

    await this.internalConn.query(sqlStr);

    return;
  }

  /**
   * 刪除匯入 CSV 暫存表
   *
   * @param tableName
   * @returns
   */
  async dropImportCsvTempTable(
    tableName: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    DROP TABLE ${tableName}
    `;

    await this.internalConn.query(sqlStr);

    return;
  }

  /**
   * 取得 CSV 暫存表資料
   *
   * @param tableName
   * @returns
   */
  async getTempCsvData(tableName: string) {
    const sqlStr = `
    SELECT * FROM ${tableName}
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 匯入通知
   * @param connection
   * @param data
   * @param sendId
   * @returns
   */
  async insert(connection, data, sendId) {
    let queryStr = /* sql */ `
    INSERT INTO Send_Notification
    (Csv_ID, Send_Source, Send_Type, Send_Info)
    VALUES ?`;

    const batchSize = 10000; // 設定批次大小

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const values = batch.map((d) => {
        const sendInfo = JSON.stringify({
          method: d?.method,
          title: d?.title,
          content: d?.content,
          email: d?.email,
          mobile: d?.mobile
        });
        return [sendId, d?.source, d?.type, sendInfo];
      });

      await this.internalConn.transactionQuery(connection, queryStr, [values]);
    }

    return;
  }

  async getAsideCardDetail(): Promise<{
    postCount: number;
    categoriesCount: number;
  }> {
    const sqlStr = `
      SELECT 
          COUNT(bp.Post_ID) AS postCount
      FROM blog_post bp 
      WHERE bp.Post_Type = 2;

      SELECT 
          COUNT(*) AS categoriesCount
      FROM blog_category bc ;
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    const postCount = result?.[0]?.[0]?.postCount;
    const categoriesCount = result?.[1]?.[0]?.categoriesCount;

    return { postCount, categoriesCount };
  }
}
