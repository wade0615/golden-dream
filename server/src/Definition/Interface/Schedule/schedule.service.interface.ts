export interface ScheduleGeneratorReq {
  frequency: string;
  scheduleName: string;
  processLockName: string;
  /** 單位 second */
  processLockTime: number;
  timeintervalStart?;
  timeintervalEnd?;
  scheduleFunction;
}
