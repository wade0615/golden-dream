import { Injectable } from '@nestjs/common';

import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { TSO_Repository } from './tso.repository';

const Parser = require('rss-parser'); // 使用 require 導入

import moment = require('moment-timezone');

@Injectable()
export class TSO_Service {
  constructor(
    private internalConn: MysqlProvider,
    private tsoRepository: TSO_Repository
  ) {}

  /**
   * 取得 BBC 新聞
   * @param keywords 關鍵字
   * @returns
   */
  getBBC = async (keywords) => {
    const parser = new Parser(); // 正確實例化 Parser
    const RSS_URL = 'https://feeds.bbci.co.uk/zhongwen/trad/rss.xml';
    const feed = await parser.parseURL(RSS_URL);

    console.log(feed.title);
    const filtered = feed.items.filter((item) => {
      const text = `${item.title} ${item.contentSnippet}`;
      return keywords.some((kw) => text.includes(kw));
    });
    const BBCNews = filtered.map((item) => {
      return {
        newsID: item.guid,
        newsTitle: item.title,
        newsContent: item.content,
        newsLink: item.link,
        newsIsoDate: item.isoDate,
        newsSource: 'BBC'
      };
    });
    return BBCNews;
  };

  /**
   * 取得 CNN 新聞
   * @param keywords 關鍵字
   * @returns
   */
  getCNN = async (keywords) => {
    const parser = new Parser(); // 正確實例化 Parser
    const RSS_URL =
      'https://news.google.com/rss/search?q=taiwan+site:cnn.com&hl=en-US&gl=US&ceid=US:en';
    const feed = await parser.parseURL(RSS_URL);
    console.log(feed.title);
    const filtered = feed.items.filter((item) => {
      const text = `${item.title} ${item.contentSnippet}`;
      return keywords.some((kw) => text.includes(kw));
    });
    const CNNNews = filtered.map((item) => {
      return {
        newsID: item.guid,
        newsTitle: item.title,
        newsContent: item.contentSnippet,
        newsLink: item.link,
        newsIsoDate: item.isoDate,
        newsSource: 'CNN'
      };
    });
    return CNNNews;
  };

  tsoSchedule = async (config) => {
    let connection;
    try {
      const date = moment().tz(process.env.TIME_ZONE_UTC);
      console.log('tsoSchedule', date);

      // 可加入關鍵字過濾
      const keywords = [
        '台',
        '台灣',
        '台海',
        '解放軍',
        '領空',
        '英偉達',
        '半導體',
        'NVIDIA',
        '台積電',
        'TSMC',
        '晶圓',
        'Taiwan',
        'Taiwan Strait',
        'PLA',
        'China Taiwan',
        'Crisis',
        'Conflict',
        'Military',
        'Tensions',
        'airspace'
      ];

      /** 取得 BBC 新聞 */
      const BBCNews = await this.getBBC(keywords);
      console.log('tsoSchedule BBCNews', BBCNews.length);
      /** 取得 CNN 新聞 */
      const CNNNews = await this.getCNN(keywords);
      console.log('tsoSchedule CNNNews', CNNNews.length);

      const tsoNews = BBCNews.concat(CNNNews);

      connection = await this.internalConn.getConnection();
      await connection.beginTransaction();

      if (tsoNews.length > 0) {
        await this.tsoRepository.addNews(connection, tsoNews);
      }

      await connection.commit();
    } catch (error) {
      console.error('Error TSO Schedule:', error);
      return;
    } finally {
      console.log('tsoSchedule finally');
      if (connection) {
        await connection.release();
      }
    }
  };
}
