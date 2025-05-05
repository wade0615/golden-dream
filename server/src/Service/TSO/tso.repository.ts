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
}
