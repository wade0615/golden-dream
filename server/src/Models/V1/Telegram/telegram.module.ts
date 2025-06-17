import { Module } from '@nestjs/common';
import { Telegram_Controller } from './telegram.controller';
import { Telegram_Service } from './telegram.service';

import { GlobalVariableService } from 'src/Global/GlobalVariable/global-variable';
import { MessageLimitGuard } from 'src/Global/Guards/message-limit.guard';
import { TelegramService } from 'src/Providers/Telegram/telegram.service';

@Module({
  imports: [],
  controllers: [Telegram_Controller],
  providers: [
    TelegramService,
    MessageLimitGuard,
    GlobalVariableService,
    Telegram_Service
  ]
})
export class Telegram_Module {}
