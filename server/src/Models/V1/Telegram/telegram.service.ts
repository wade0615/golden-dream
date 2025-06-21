import { HttpStatus, Injectable } from '@nestjs/common';

import { TelegramService } from 'src/Providers/Telegram/telegram.service';

import { PostTgMsgReq, PostTgMsgResp } from './Dto';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@Injectable()
export class Telegram_Service {
  constructor(private telegramService: TelegramService) {}

  /**
   *  發送 Telegram 訊息
   * @returns
   */
  async postTelegramMsg(req: PostTgMsgReq): Promise<PostTgMsgResp> {
    try {
      const chatId = process.env.CHAT_ID;
      if (!chatId) {
        throw new Error('CHAT_ID environment variable is not set');
      }

      let tgMsg = req.msg || 'No message provided';
      if (!tgMsg) {
        throw new Error('Message is required');
      }
      tgMsg = `
        Sender: ${req.name}\nContent: ${tgMsg}
      `;
      // 發送 Telegram 訊息
      await this.telegramService.sendMessage(chatId, tgMsg);

      return {
        result: 'Telegram message sent successfully'
      };
    } catch (error) {
      console.error('post telegram msg service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
