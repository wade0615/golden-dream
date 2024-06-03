import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverAliveTest(): string {
    const env = process.env.APP_ENV_TEST;
    return env;
  }
}
