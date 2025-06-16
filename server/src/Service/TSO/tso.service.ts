import { Injectable } from '@nestjs/common';

import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { TSO_Repository } from './tso.repository';

import { OpenAIService } from 'src/Providers/Openai/openai.service';
import { TelegramService } from 'src/Providers/Telegram/telegram.service';

const Parser = require('rss-parser'); // 使用 require 導入

import moment = require('moment-timezone');

@Injectable()
export class TSO_Service {
  constructor(
    private internalConn: MysqlProvider,
    private tsoRepository: TSO_Repository,
    private telegramService: TelegramService,
    private openAIService: OpenAIService
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

  /**
   * 取得 NYT 新聞
   * @param keywords 關鍵字
   * @returns
   */
  getNYT = async (keywords) => {
    const parser = new Parser(); // 正確實例化 Parser
    const RSS_URL =
      'https://news.google.com/rss/search?q=taiwan+site:nytimes.com&hl=en-US&gl=US&ceid=US:en';
    const feed = await parser.parseURL(RSS_URL);
    console.log(feed.title);
    const filtered = feed.items.filter((item) => {
      const text = `${item.title} ${item.contentSnippet}`;
      return keywords.some((kw) => text.includes(kw));
    });
    const NYTNews = filtered.map((item) => {
      return {
        newsID: item.guid,
        newsTitle: item.title,
        newsContent: item.contentSnippet,
        newsLink: item.link,
        newsIsoDate: item.isoDate,
        newsSource: 'NYT'
      };
    });
    return NYTNews;
  };

  /**
   * 台海觀測站新聞搜集排程
   * @param config
   */
  tsoNewsCollectSchedule = async (config) => {
    let connection;
    let BBCNews = [];
    let CNNNews = [];
    let NYTNews = [];
    let tsoNews = [];
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
      BBCNews = await this.getBBC(keywords);
      console.log('tsoSchedule BBCNews', BBCNews.length);
      /** 取得 CNN 新聞 */
      CNNNews = await this.getCNN(keywords);
      console.log('tsoSchedule CNNNews', CNNNews.length);
      /** 取得 NYT 新聞 */
      NYTNews = await this.getNYT(keywords);
      console.log('tsoSchedule NYTNews', NYTNews.length);

      tsoNews = BBCNews.concat(CNNNews).concat(NYTNews);

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

      const chatId = process.env.CHAT_ID;
      if (!chatId) {
        throw new Error('CHAT_ID environment variable is not set');
      }
      const tgMsg =
        `台海觀測站新聞搜集完成時間： ${moment()
          .tz(process.env.TIME_ZONE_UTC)
          .format('YYYY-MM-DD HH:mm:ss')}\n` +
        `總共抓到新聞數: ${tsoNews.length}\n` +
        `BBC News: ${BBCNews.length}, CNN News: ${CNNNews.length}, NYT News: ${NYTNews.length}`;
      // 發送 Telegram 訊息
      await this.telegramService.sendMessage(chatId, tgMsg);
    }
  };

  /**
   * 台海觀測站新聞處理排程
   * @param config
   */
  tsoNewsHandleSchedule = async (config) => {
    let connection;
    let openaiHandledNewsCount = 0;
    let isAboutTaiwanCount = 0;
    try {
      connection = await this.internalConn.getConnection();
      await connection.beginTransaction();

      // 取得未處理的新聞
      const unhandledNews = await this.tsoRepository.getUnhandledNews(
        connection
      );

      if (unhandledNews.length > 0) {
        console.log(
          'tsoNewsHandleSchedule unhandledNews',
          unhandledNews.length
        );
        openaiHandledNewsCount = unhandledNews.length;

        let processedNews = [];
        // 處理新聞邏輯
        for (const news of unhandledNews) {
          // 使用 OpenAI 處理新聞內容
          const processedContent = await this.openAIService.processNewsContent(
            news.newsContent
          );
          if (processedContent.isAboutTaiwan) {
            processedNews.push({
              newsID: news.newsID,
              newsTitle: news.newsTitle,
              // zhHantContent: processedContent.zhHantContent,
              newsLink: news.newsLink,
              isProcessed: true
            });
            isAboutTaiwanCount++;
          }
        }
        await this.tsoRepository.updateHandledNews(connection, processedNews);
      }

      await connection.commit();
    } catch (error) {
      console.error('Error TSO News Handle Schedule:', error);
      return;
    } finally {
      console.log('tsoNewsHandleSchedule finally');
      if (connection) {
        await connection.release();
      }
      const chatId = process.env.CHAT_ID;
      if (!chatId) {
        throw new Error('CHAT_ID environment variable is not set');
      }
      const tgMsg =
        `台海觀測站新聞處理完成時間： ${moment()
          .tz(process.env.TIME_ZONE_UTC)
          .format('YYYY-MM-DD HH:mm:ss')}\n` +
        `總共處理新聞數: ${openaiHandledNewsCount}，共有 ${isAboutTaiwanCount} 條新聞與台灣相關。`;
      // 發送 Telegram 訊息
      await this.telegramService.sendMessage(chatId, tgMsg);
    }
  };
}
