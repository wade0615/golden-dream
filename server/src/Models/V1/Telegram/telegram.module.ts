import { Module } from '@nestjs/common';
import { Telegram_Controller } from './telegram.controller';
import { Telegram_Service } from './telegram.service';

import { GlobalVariableService } from 'src/Global/GlobalVariable/global-variable';
import { MessageLimitGuard } from 'src/Global/Guards/message-limit.guard';
import { TelegramModule } from 'src/Providers/Telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [Telegram_Controller],
  providers: [MessageLimitGuard, GlobalVariableService, Telegram_Service]
})
export class Telegram_Module {}
