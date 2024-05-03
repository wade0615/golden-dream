import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

import { ConfigAppService } from './config.service';
import configuration from './configuration';

/**
 * Import and provide app configuration related classes.
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
            `${process.env.APP_ENV.toUpperCase()}.env`,
          )) ||
        '.env',
      load: [configuration],
    }),
  ],
  providers: [ConfigService, ConfigAppService],
  exports: [ConfigService, ConfigAppService],
})
export class ConfigAppModule {}
