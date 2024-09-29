import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with mysql config based operations.
 *
 * @class
 */
@Injectable()
export class ConfigMysqlService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('personal_db.host');
  }
  get port(): number {
    return Number(this.configService.get<number>('personal_db.port'));
  }
  get username(): string {
    return this.configService.get<string>('personal_db.username');
  }
  get password(): string {
    return this.configService.get<string>('personal_db.password');
  }
  get database(): string {
    return this.configService.get<string>('personal_db.database');
  }
}
