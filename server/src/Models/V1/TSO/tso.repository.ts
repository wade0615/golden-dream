import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

@Injectable()
export class TSO_Repository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得 TSO 的新聞
   * @param code
   * @returns
   */
  async getTsoNews(): Promise<string> {
    const sqlStr = `
      SELECT 
        tn.Seq id,
        tn.News_Title title,
        tn.News_Content description,
        tn.News_Source source,
        tn.News_Link url
      FROM tso_news tn 
      WHERE tn.Is_Active = 1
        AND tn.Create_Date >= NOW() - INTERVAL 1 MONTH;
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }
}
