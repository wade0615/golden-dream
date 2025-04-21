import { Injectable, OnModuleInit } from '@nestjs/common';
import { TSO_ScheduleService } from './TSO/tso.schedule';

@Injectable()
export class BatchScheduleService implements OnModuleInit {
  constructor(private readonly tsoScheduleService: TSO_ScheduleService) {}

  async onModuleInit() {
    /** taiwan-strait-observatory 台海觀測站 */
    this.tsoScheduleService.tsoSchedule();
  }
}
