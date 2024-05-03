import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { ELK_LEVEL } from 'src/Definition/Enum/elk.level.enum';
import { ELKLogObj } from 'src/Definition/Interface/Log/print.log.elk.third.party.interface';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { LogService } from 'src/Utils/log.service';
const crypto = require('crypto');

@Injectable()
export class ApiService {
  constructor(
    private readonly http: HttpService,
    private readonly logService: LogService
  ) {}

  async get(url: string, headersOptions) {
    return this.api('get', url, headersOptions, {});
  }

  async post(url: string, headersOptions, body: any = {}) {
    return this.api('post', url, headersOptions, body);
  }

  async api(type: string, url: string, headersOptions, body: any = {}) {
    let headers = {
      'Content-Type': 'application/json'
    };
    let statusCode;
    let result;
    try {
      if (headersOptions) {
        Object.keys(headersOptions).forEach((key) => {
          headers[key] = headersOptions[key];
        });
      }

      switch (type) {
        case 'get':
          result = await this.http.get(url, { headers }).toPromise();
          result = result['data'];
          statusCode = result?.statusCode;
          break;
        case 'post':
          result = await this.http.post(url, body, { headers }).toPromise();
          result = result['data'];
          statusCode = result?.statusCode;
          break;
        case 'put':
          break;
        case 'delete':
          break;
        default:
      }

      const elkLogObj = <ELKLogObj>{};
      elkLogObj.level = ELK_LEVEL.INFO;
      elkLogObj.method = type;
      elkLogObj.msg = '';
      elkLogObj.request = body;
      elkLogObj.route = url;
      elkLogObj.code = statusCode;
      elkLogObj.response = result;
      elkLogObj.timing = 'ApiService';
      elkLogObj.service = process.env.APP_NAME;

      this.logService.printELKLog(elkLogObj);

      return result;
    } catch (error) {
      const elkLogObj = <ELKLogObj>{};
      elkLogObj.level = ELK_LEVEL.WARN;
      elkLogObj.method = type;
      elkLogObj.msg = error?.message;
      elkLogObj.request = body;
      elkLogObj.route = url;
      elkLogObj.code = statusCode;
      elkLogObj.response = result;
      elkLogObj.timing = 'ApiService';
      elkLogObj.service = process.env.APP_NAME;

      this.logService.printELKLog(elkLogObj);
      // throw new CustomerException(configError._200004, HttpStatus.OK);
    }
  }

  /**
   * CRM POST CURL
   *
   * @param url
   * @param headersOptions
   * @param body
   * @returns
   */
  async oAuthPostAllowFail(url: string, headersOptions, body: any = {}) {
    try {
      const res = await this.api('post', url, headersOptions, body);

      // oAuth API 連線失敗
      if (!res) {
        throw new CustomerException(configError._200002, HttpStatus.OK);
      }

      if (res?.rcrm?.RC !== 1) {
        throw new CustomerException(
          {
            code: res?.statusCode,
            msg: res?.rcrm?.RM
          },
          HttpStatus.OK
        );
      }

      return res?.results;
    } catch (err) {
      console.log('[oAuthPost] OAuth呼叫失敗', err);
    }
  }

  /**
   * CRM POST CURL
   *
   * @param url
   * @param headersOptions
   * @param body
   * @returns
   */
  async oAuthPost(url: string, headersOptions, body: any = {}) {
    const res = await this.api('post', url, headersOptions, body);

    // oAuth API 連線失敗
    if (!res) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }

    if (res?.rcrm?.RC !== 1) {
      throw new CustomerException(
        {
          code: res?.statusCode,
          msg: res?.rcrm?.RM
        },
        HttpStatus.OK
      );
    }

    return res?.results;
  }
}
