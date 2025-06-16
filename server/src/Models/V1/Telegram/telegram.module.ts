import { Module } from '@nestjs/common';
import { Telegram_Controller } from './telegram.controller';
import { Telegram_Service } from './telegram.service';

@Module({
  imports: [],
  controllers: [Telegram_Controller],
  providers: [Telegram_Service]
})
export class Telegram_Module {}
