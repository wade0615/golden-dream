import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

import { ConfigKafkaService } from './config.service';
import configuration from './configuration';

/**
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        (process.env.APP_ENV &&
          path.join(
            process.cwd(),
            'env',
            `${process.env.APP_ENV.toUpperCase()}.env`
          )) ||
        '.env',
      load: [configuration]
    })
  ],
  providers: [ConfigService, ConfigKafkaService],
  exports: [ConfigService, ConfigKafkaService]
})
export class ConfigKafkaModule {}
