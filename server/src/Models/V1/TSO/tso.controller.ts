import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { TSO_Service } from './tso.service';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('tso')
@Controller('tso')
export class TSO_Controller {
  constructor(private readonly tsoService: TSO_Service) {}

  /**
   * 取得 TSO 新聞列表
   * @param body
   * @returns
   */
  @Get(apiPath.tso.getTsoNews)
  async getTsoNews(@Req() req) {
    try {
      console.log('TSO controller');
      const result = await this.tsoService.getTsoNews();

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
