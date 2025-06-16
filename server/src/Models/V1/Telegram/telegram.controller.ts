import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { Telegram_Service } from './telegram.service';

import { PostTgMsgDto } from './Dto';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('telegram')
@Controller('telegram')
export class Telegram_Controller {
  constructor(private readonly telegramService: Telegram_Service) {}

  /**
   *  發送 Telegram 訊息
   * @param body
   * @returns
   */
  @Post(apiPath.telegram.postTelegramMsg)
  async postTelegramMsg(@Body() body: PostTgMsgDto) {
    try {
      const result = await this.telegramService.postTelegramMsg(body);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
