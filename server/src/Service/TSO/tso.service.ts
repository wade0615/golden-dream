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

  tsoSchedule = async (config) => {
    let connection;
    try {
      const parser = new Parser(); // 正確實例化 Parser

      const date = moment().tz(process.env.TIME_ZONE_UTC);
      console.log('tsoSchedule', date);

      const RSS_URL = 'https://feeds.bbci.co.uk/zhongwen/trad/rss.xml';
      const feed = await parser.parseURL(RSS_URL);
      console.log(feed.title);
      // 可加入關鍵字過濾
      const keywords = ['台', '台灣', '台海', '解放軍'];
      const filtered = feed.items.filter((item) => {
        const text = `${item.title} ${item.contentSnippet}`;
        return keywords.some((kw) => text.includes(kw));
      });

      // 這裡可以將過濾後的資料存入資料庫
      console.log('Filtered items:', filtered?.length);
      const tsoNews = filtered.map((item) => {
        // console.log(item.title + ':' + item.link);
        // console.log(item.contentSnippet);
        // console.log(item.pubDate);
        return {
          newsID: item.guid,
          newsTitle: item.title,
          newsContent: item.content,
          newsLink: item.link,
          newsIsoDate: item.isoDate,
          newsSource: 'BBC'
        };
      });

      connection = await this.internalConn.getConnection();
      await connection.beginTransaction();

      await this.tsoRepository.addNews(connection, tsoNews);

      await connection.commit();
    } catch (error) {
      console.error('Error TSO Schedule:', error);
      return;
    }
  };
}
