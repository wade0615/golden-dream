import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import { AddNewsInterface } from './Interface/add.news.interface';

@Injectable()
export class TSO_Repository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 寫入 RSS 取得的新聞
   * @param code
   * @returns
   */
  async addNews(connection, req: AddNewsInterface[]): Promise<any> {
    const sqlStr = `
      INSERT INTO tso_news 
      (News_ID, News_Title, News_Content, News_Link, News_IsoDate, News_Source, 
      Create_ID, Alter_ID, Is_Active) 
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        -- News_Title = VALUES(News_Title), 
        News_Content = VALUES(News_Content),
        News_Link = VALUES(News_Link),
        News_IsoDate = VALUES(News_IsoDate),
        News_Source = VALUES(News_Source)
    `;

    // 將資料轉換為批量插入的格式
    const values = req.map((_news) => [
      _news.newsID,
      _news.newsTitle,
      _news.newsContent,
      _news.newsLink,
      _news.newsIsoDate,
      _news.newsSource,
      'system', // Create_ID
      'system', // Alter_ID
      1 // Is_Active
    ]);

    // 使用批量插入
    await this.internalConn.transactionQuery(connection, sqlStr, [values]);

    return true;
  }

  /**
   * 取得尚未處理過的新聞
   * @returns
   */
  async getUnhandledNews(connection): Promise<any> {
    const sqlStr = `
      SELECT 
        News_ID newsID,
        News_Title newsTitle,
        News_Content newsContent,
        News_Link newsLink,
        News_IsoDate,
        News_Source
      FROM tso_news 
      WHERE Is_Active = 1 AND Is_Processed = 0
    `;

    const result = await this.internalConn.transactionQuery(connection, sqlStr);
    return result;
  }

  /**
   * 更新新聞處理狀態
   * @param newsID
   * @returns
   */
  async updateHandledNews(
    connection,
    processedNews: {
      newsID: string;
      newsTitle: string;
      // zhHantContent: string;
      newsLink: string;
      isProcessed: boolean;
    }[]
  ): Promise<any> {
    const sqlStr = `
      CREATE TEMPORARY TABLE Temp_News_Target AS (
        SELECT tson.News_ID AS id
        FROM tso_news tson
        WHERE tson.News_ID IN (?)
      );

      UPDATE tso_news tn
      INNER JOIN Temp_News_Target AS tnt
        ON tnt.id = tn.News_ID
      SET Is_Processed = 1;

      DROP TEMPORARY TABLE IF EXISTS Temp_News_Target;
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      processedNews.map((news) => news.newsID)
    ]);

    return true;
  }
}
