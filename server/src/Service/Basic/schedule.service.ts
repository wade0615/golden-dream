import { Injectable } from '@nestjs/common';
import * as schedule from 'node-schedule';

import { ELK_LEVEL } from 'src/Definition/Enum/elk.level.enum';
import { ENUM_CONFIG } from 'src/Definition/Enum/schedule.config.enum';
import { ELKLogObj } from 'src/Definition/Interface/Log/print.log.elk.third.party.interface';
import { ScheduleGeneratorReq } from 'src/Definition/Interface/Schedule/schedule.service.interface';

// import { CacheService } from '../cache.service';
import { LogService } from 'src/Utils/log.service';
import moment = require('moment-timezone');

@Injectable()
export class ScheduleService {
  constructor(
    // private readonly cacheService: CacheService,
    private readonly logService: LogService
  ) {}
  scheduleGenerator = async (config: ScheduleGeneratorReq) => {
    //Q: elk log 沒有統一控管
    const ELK_LOG_OBJ = <ELKLogObj>{};
    ELK_LOG_OBJ.request = JSON.stringify(config);
    ELK_LOG_OBJ.level = ELK_LEVEL.INFO;
    ELK_LOG_OBJ.service = ENUM_CONFIG.SERVER_NAME;
    ELK_LOG_OBJ.timing = 'prepare';
    try {
      schedule.scheduleJob(config?.frequency, async () => {
        // 初始化，沒有的話就幫他生成一個開關 ； 預測關掉
        // const isEnable = await this.cacheService.getCacheData(
        //   config?.scheduleName
        // );
        // if (!isEnable) {
        //   this.cacheService.setCacheData(
        //     config?.scheduleName,
        //     'disable',
        //     null,
        //     false
        //   );
        // }

        // // 若有給時間區間，檢查是否於區間內
        // if (config?.timeintervalStart && config?.timeintervalEnd) {
        //   const isStartTime = this.checkTimeIntervals(
        //     config?.scheduleName,
        //     config?.timeintervalStart,
        //     config?.timeintervalEnd
        //   );
        //   if (!isStartTime) return; // ziv : 補上哪個服務不在時間區間內呼叫
        // }

        // 檢查是否開啟
        // if (!isEnable || isEnable !== 'enable') {
        //   ELK_LOG_OBJ.msg = `${config?.scheduleName} 關閉中！！ : ${isEnable}}`;
        //   this.logService.printELKLog(ELK_LOG_OBJ);
        //   return;
        // }

        // ziv 20240517 pre-text 替換
        // 檢查是否有已經完成/進行中的標記
        // const isLock = await this.cacheService.getCacheData(
        //   config?.processLockName
        // );
        // if (isLock) {
        //   // 重複執行事件
        //   ELK_LOG_OBJ.msg = `${config?.processLockName} 事件已執行。`;
        //   this.logService.printELKLog(ELK_LOG_OBJ);
        //   return;
        // }

        // Ziv 印太多了，不要每次都印
        // 統一列印 runtime elk log ; 有時間戳記
        // ELK_LOG_OBJ.msg = `${config?.scheduleName} : 排程啟動成功!`;
        // this.logService.printELKLog(ELK_LOG_OBJ);
        // 啟動 func
        if (config.scheduleFunction) config.scheduleFunction(config);
      });
    } catch (error) {
      // 發生錯誤，刪除進行中標記
      // await this.cacheService.delCacheData(config?.processLockName);

      ELK_LOG_OBJ.msg = `${config?.scheduleName} : 排程啟動失敗!!, ${error.message}`;
      ELK_LOG_OBJ.level = ELK_LEVEL.ERROR;
      this.logService.printELKLog(ELK_LOG_OBJ);
    }
  };

  /**
   * 檢核當前時間是否在時間區間
   * @param scheduleName 排程名稱
   * @param timeintervalStart 開始時間
   * @param timeintervalEnd 結束時間
   * @param printLog 是否印 log
   * @returns
   */
  // checkTimeIntervals = (
  //   scheduleName: string,
  //   timeintervalStart: string,
  //   timeintervalEnd: string,
  //   printLog = true
  // ): boolean => {
  //   const currentTime = moment.tz(process.env.TIME_ZONE_UTC);
  //   const today = moment
  //     .tz(process.env.TIME_ZONE_UTC)
  //     .format(process.env.DATE_ONLY);
  //   let start = moment.tz(
  //     `${today} ${timeintervalStart}`,
  //     process.env.DATE_TIME,
  //     process.env.TIME_ZONE_UTC
  //   );
  //   let end = moment.tz(
  //     `${today} ${timeintervalEnd}`,
  //     process.env.DATE_TIME,
  //     process.env.TIME_ZONE_UTC
  //   );

  //   const logObj = <ELKLogObj>{};
  //   logObj.level = ELK_LEVEL.INFO;
  //   logObj.service = ENUM_CONFIG.SERVER_NAME;
  //   logObj.timing = `[scheduleGenerator] building`;

  //   // e.g. start:12:00 end:00:00 => 今天的 12:00 ~ 隔天 00:00 執行
  //   if (start >= end) {
  //     end = end.add(1, 'd');
  //     if (!currentTime.isBetween(start, end)) {
  //       logObj.msg = `[${scheduleName}] 將於 ${start.format(
  //         process.env.DATE_TIME
  //       )} 到 ${end.format(process.env.DATE_TIME)} 間開始`;
  //       if (printLog) this.logService.printELKLog(logObj);

  //       return false;
  //     }
  //   }

  //   // e.g. start:00:00 end:12:00 => 今天的 00:00 ~ 今天 12:00 執行
  //   if (start < end) {
  //     if (!currentTime.isBetween(start, end)) {
  //       logObj.msg = `[${scheduleName}] 已於 ${start.format(
  //         process.env.DATE_TIME
  //       )} 到 ${end.format(process.env.DATE_TIME)} 間結束`;
  //       if (printLog) this.logService.printELKLog(logObj);

  //       return false;
  //     }
  //   }

  //   return true;
  // };
}
