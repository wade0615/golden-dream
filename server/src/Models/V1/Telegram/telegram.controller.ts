import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { Telegram_Service } from './telegram.service';

import { PostTgMsgReq, PostTgMsgResp } from './Dto';

import { MessageLimitGuard } from 'src/Global/Guards/message-limit.guard';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('tg')
@Controller('tg')
export class Telegram_Controller {
  constructor(private readonly telegramService: Telegram_Service) {}

  /**
   *  發送 Telegram 訊息
   * @param body
   * @returns
   */
  @Post(apiPath.telegram.postTelegramMsg)
  @UseGuards(MessageLimitGuard)
  async postTelegramMsg(@Body() body: PostTgMsgReq): Promise<PostTgMsgResp> {
    try {
      const result = await this.telegramService.postTelegramMsg(body);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
