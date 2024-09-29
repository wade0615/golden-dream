import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

@Injectable()
export class TestRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得第一筆 DB 資料
   * @param code
   * @returns
   */
  async getDB(): Promise<string> {
    const sqlStr = `
      SELECT *
      FROM blog_post bp 
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0];
  }
}
