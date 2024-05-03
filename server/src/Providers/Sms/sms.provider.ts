import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { ApiService } from 'src/Providers/Api/api.service';
import { LogService } from 'src/Utils/log.service';
import { SendSmsReq } from './Interface/send.sms.interface';
const apiService = new ApiService(new HttpService(), new LogService());
@Injectable()
export class SmsProvider {
  constructor() {}

  /**
   * 立即發送 sms
   * @param req
   * @returns
   */
  async sendSms(req: SendSmsReq): Promise<Record<string, never>> {
    const url = encodeURI(
      `${config.SMS.URL}API21/HTTP/SendSMS4FilterMessage.ashx`
    );

    const body = new URLSearchParams({
      UID: config.SMS.USER_NAME, // 帳號
      PWD: `${config.SMS.PWD}#hDW6$F1`, // 密碼
      SB: '', // 簡訊主旨
      ST: '', // 預約時間：空字串為立即發送
      DEST: req?.mobile, // 手機號碼
      MSG: req?.message // 簡訊內容
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };

    try {
      // call sms
      // 成功後會回傳 4930.00,1,1,0,a3c9462e-c381-4691-bd2e-c587d1f77e44
      //發送後剩餘點數。發送通數。本次發送扣除點數。無額度時發送的通數。批次識別代碼。
      const smsResultArr = (await apiService.post(url, headers, body))?.split(
        ','
      );
      // 判斷回傳值是否有批次識別代碼
      const reg = new RegExp(
        /^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}$/
      );
      const smsSuccess = smsResultArr?.find((x) => reg.test(x));

      if (!smsResultArr?.length || !smsSuccess)
        throw Error(configError._420001.msg);
    } catch (error) {
      throw new CustomerException(
        {
          code: configError._420001?.code,
          msg: error?.message
        },
        HttpStatus.OK
      );
    }

    return {};
  }
}
