import { Injectable } from '@nestjs/common';
import {
  ENUM_CONFIG,
  ENUM_FREQUENCY
} from 'src/Definition/Enum/schedule.config.enum';
import { ScheduleGeneratorReq } from 'src/Definition/Interface/Schedule/schedule.service.interface';
import { ScheduleService } from 'src/Service/Basic/schedule.service';

import { TSO_Service } from './tso.service';

/**
 * 台海觀測站排程服務
 * TSO_ScheduleService
 */
@Injectable()
export class TSO_ScheduleService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly tsoService: TSO_Service
  ) {}

  // tso 新聞資料收集
  tsoNewsCollectSchedule = () => {
    const config = <ScheduleGeneratorReq>{};
    config.frequency = ENUM_FREQUENCY.EVERY_SIX_HOUR;
    config.scheduleName = 'tsoNewsCollectSchedule';
    config.processLockName = `${ENUM_CONFIG.PROCESS_LOCK}:tsoNewsCollect`;
    config.processLockTime = 10 * 60;
    config.scheduleFunction = this.tsoService.tsoNewsCollectSchedule;
    this.scheduleService.scheduleGenerator(config);
  };

  // tso 新聞資料判斷與翻譯
  tsoNewsHandleSchedule = () => {
    const config = <ScheduleGeneratorReq>{};
    config.frequency = ENUM_FREQUENCY.EVERY_SIX_HOUR_TEN_MINUTE;
    config.scheduleName = 'tsoNewsHandleSchedule';
    config.processLockName = `${ENUM_CONFIG.PROCESS_LOCK}:tsoNewsHandle`;
    config.processLockTime = 10 * 60;
    config.scheduleFunction = this.tsoService.tsoNewsHandleSchedule;
    this.scheduleService.scheduleGenerator(config);
  };
}
