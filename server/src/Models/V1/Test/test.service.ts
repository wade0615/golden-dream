import { HttpStatus, Injectable } from '@nestjs/common';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { TestRepository } from './test.repository';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class TestService {
  constructor(private testRepository: TestRepository) {}

  /**
   * 打到 DB 啦
   * @returns
   */
  async getDB(): Promise<any> {
    try {
      console.log('getDB service');
      const result = await this.testRepository.getDB();

      return result;
    } catch (error) {
      console.error('getDB service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
