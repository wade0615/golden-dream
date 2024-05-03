import { Injectable } from '@nestjs/common';
import { ApiLogWhite } from 'src/Config/White/api.log.white';
import { ELKLogObj } from 'src/Definition/Interface/Log/print.log.elk.third.party.interface';
import { UTCToTimeString } from 'src/Utils/tools';

const fs = require('fs');
const path = require('path');

@Injectable()
export class LogService {
  /**
   * 印 log 在本機
   * @param req
   * @param result
   */
  async printLogToLocal(req, result) {
    const now = Date.now();
    const date = UTCToTimeString(now).split(' ')[0];
    const folderPath = path.join(__dirname, 'logger');

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  /**
   * 紀錄錯誤ELK
   *
   * @param func
   * @param sourceType
   * @param level
   * @param msg
   * @param code
   * @param timing
   */
  printErrorELK(
    func: string,
    sourceType: string,
    level: string,
    msg,
    code?,
    timing?: string
  ) {
    const now = Date.now();

    const logELK = `function=${func}|level=${level}|msg=${msg ?? ''}|code=${
      code ?? ''
    }|exectime=${Date.now() - now}ms|time=${UTCToTimeString(now)}|timing=${
      timing ?? 'end'
    }|sourceType=${sourceType}|service=crm_backstage`;

    console.log(logELK);
  }

  /**
   * print elk log / time 可以不用帶，自動帶當前時間
   * @param reqObj
   */
  printELKLog(reqObj: ELKLogObj) {
    // [check][1]request JSON.stringify error handle
    try {
      reqObj.request = reqObj?.request
        ? JSON.stringify(reqObj?.request?.body || reqObj?.request)
        : null;
    } catch (error) {
      reqObj.request = error.message;
    }
    // [check][2] response JSON.stringify error handle
    try {
      // if string too long then don't print.
      let response = reqObj?.response ? JSON.stringify(reqObj?.response) : '';
      const resLen = response?.length ?? 0;
      response =
        resLen < 100 ? response : `${reqObj?.route} response length too long.`;
      reqObj.response = response;
    } catch (error) {
      reqObj.response = error.message;
    }

    // [pre][1] add now time
    const now = new Date();
    reqObj.time = UTCToTimeString(now);
    // ?.replace(/[=|]/g, '')
    // [1] get elk log string; 同時移除值的 | & =
    let elkLogStr = '';
    Object.keys(reqObj).forEach(
      (key) => (elkLogStr += `${key}=${reqObj[key]}|`)
    );
    // [end] print
    console.info(elkLogStr);
  }

  /**
   * ******* 已棄用 *******
   * 印 log 在本機
   * @param req
   * @param resp
   */
  async printLogELK(req, resp, level, msg?, code?, timing?, result?) {
    const now = Date.now();
    const { authorization } = req?.headers;
    const token = authorization?.split(' ')[1];

    let response = '';
    if (ApiLogWhite.includes(req?.url)) {
      response = JSON.stringify(result);
    }

    const logELK = `method=${req.method}|route=${req.originalUrl}|sourceIP=${
      req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress
    }|userAgent=${
      req.get('User-Agent') || req.headers['user-agent']
    }|level=${level}|msg=${msg ?? ''}|code=${code ?? ''}|exectime=${
      Date.now() - now
    }ms|time=${UTCToTimeString(now)}|status=${resp?.statusCode ?? ''}|token=${
      token || ''
    }|timing=${timing ?? 'end'}|request=${JSON.stringify(req.body)}|response=${
      response ?? ''
    }|service=crm_backstage`;

    console.log(logELK);
  }
}
