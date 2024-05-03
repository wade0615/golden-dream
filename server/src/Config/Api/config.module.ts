import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envFilePath } from '../loadENV';
import { ConfigApiService } from './config.service';
import configuration from './configuration';

/**
 * Import and provide pi configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [configuration],
    }),
  ],
  providers: [ConfigService, ConfigApiService],
  exports: [ConfigService, ConfigApiService],
})
export class ConfigApiModule {}
