import { HttpStatus, Injectable } from '@nestjs/common';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { TSO_Repository } from './tso.repository';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class TSO_Service {
  constructor(private tsoRepository: TSO_Repository) {}

  /**
   * 取得 TSO 新聞列表
   * @returns
   */
  async getTsoNews(): Promise<any> {
    try {
      const result = await this.tsoRepository.getTsoNews();

      return result;
    } catch (error) {
      console.error('getDB service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
