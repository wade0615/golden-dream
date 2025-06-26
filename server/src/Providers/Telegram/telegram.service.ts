import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  onModuleInit() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true
    });

    // 監聽收到的訊息
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, '收到你的訊息了！');
    });
  }

  public async sendMessage(chatId: number | string, text: string) {
    await this.bot.sendMessage(chatId, text);
    return `Message sent to chat ${chatId}: ${text}`;
  }
}
