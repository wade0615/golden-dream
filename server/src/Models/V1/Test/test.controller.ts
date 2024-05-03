import { Controller, Get, Logger, VERSION_NEUTRAL } from '@nestjs/common';
import { ServiceResponseStatus } from '../../../Definition/index';

@Controller({
  version: VERSION_NEUTRAL,
  path: '/v1/test',
})
export class TestController {
  private readonly logger = new Logger(TestController.name);
  constructor() {}

  @Get()
  async test(): Promise<any> {
    const result = {
      status: ServiceResponseStatus.OK,
      data: 'haha',
    };
    this.logger.debug(result);

    return result;
  }
}
