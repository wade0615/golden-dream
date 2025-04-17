import { Injectable } from '@nestjs/common';
import {
  ENUM_CONFIG,
  ENUM_FREQUENCY
} from 'src/Definition/Enum/schedule.config.enum';
import { ScheduleGeneratorReq } from 'src/Definition/Interface/Schedule/schedule.service.interface';
import { ScheduleService } from 'src/Service/Basic/schedule.service';

import { TSO_Service } from './tso.service';

@Injectable()
export class TSO_ScheduleService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly tsoService: TSO_Service
  ) {}

  // taiwan-strait-observatory 台海觀測站
  tsoSchedule = () => {
    const config = <ScheduleGeneratorReq>{};
    config.frequency = ENUM_FREQUENCY.FIVE_SECOND;
    config.scheduleName = 'taiwan-strait-observatory';
    config.processLockName = `${ENUM_CONFIG.PROCESS_LOCK}:taiwan-strait-observatory`;
    config.processLockTime = 10 * 60;
    config.scheduleFunction = this.tsoService.tsoSchedule;
    this.scheduleService.scheduleGenerator(config);
  };
}
