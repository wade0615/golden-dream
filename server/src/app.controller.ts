import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serverAliveTest(): string {
    return this.appService.serverAliveTest();
  }
}
