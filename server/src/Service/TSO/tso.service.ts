import { Injectable } from '@nestjs/common';

import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import moment = require('moment-timezone');

@Injectable()
export class TSO_Service {
  constructor(private internalConn: MysqlProvider) {}

  tsoSchedule = async (config) => {
    // const now = new Date();
    const date = moment().tz(process.env.TIME_ZONE_UTC);
    console.log('tsoSchedule', date);
  };
}
