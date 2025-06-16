import { HttpStatus, Injectable } from '@nestjs/common';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { TelegramService } from 'src/Providers/Telegram/telegram.service';

@Injectable()
export class Telegram_Service {
  constructor(private readonly telegramService: TelegramService) {
  }

  /**
   *  發送 Telegram 訊息
   * @returns
   */
  async postTelegramMsg(req): Promise<any> {
    try {
        const chatId = process.env.CHAT_ID;
        if (!chatId) {
            throw new Error('CHAT_ID environment variable is not set');
        }

        const tgMsg = req.body.msg || 'No message provided';
        if (!tgMsg) {
            throw new Error('Message is required');
        }
        // 發送 Telegram 訊息
        await this.telegramService.sendMessage(chatId, tgMsg)

      return true;
    } catch (error) {
      console.error('post telegram msg service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
