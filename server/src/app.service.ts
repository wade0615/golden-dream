import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverAliveTest(): string {
    const envv = process.env.APP_ENV_TEST;
    return envv;
  }
}
