import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class ConfigAppService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name');
  }
  get env(): string {
    return this.configService.get<string>('app.env');
  }
  get domain(): string {
    return this.configService.get<string>('app.domain');
  }
  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }
  get redisHost(): string {
    return this.configService.get<string>('app.redisHost');
  }
  get redisPort(): number {
    return this.configService.get<number>('app.redisPort');
  }
  get redisPassword(): string {
    return this.configService.get<string>('app.redisPassword');
  }
  get redisDb(): number {
    return this.configService.get<number>('app.redisDb');
  }

  get keepAliveTimeout(): number {
    return this.configService.get<number>('app.keepAliveTimeout');
  }

  get headersTimeout(): number {
    return this.configService.get<number>('app.headersTimeout');
  }
}
