import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Config {
  [key: string]: string | number;
}

/**
 * Service dealing with mysql config based operations.
 *
 * @class
 */
@Injectable()
export class ConfigKafkaService {
  constructor(private configService: ConfigService<Config>) {}

  get<T extends keyof Config>(key: T): Config[T] {
    return this.configService.get<Config[T]>(key);
  }

  get host(): string {
    return this.configService.get<string>('kafka.host');
  }
  get port(): number {
    return Number(this.configService.get<number>('kafka.port'));
  }
  get userName(): string {
    return this.configService.get<string>('kafka.userName');
  }
  get password(): string {
    return this.configService.get<string>('kafka.password');
  }
}
