// nest native
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
// Others
import { memoryStorage } from 'multer';
import { join } from 'path';
// main app
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AppConfigService } from './config/app/config.service';
import { ConfigApiModule } from './Config/Api/config.module';
import { ConfigAppModule } from './Config/App/config.module';
// Middleware
import { RequestIdMiddleware } from './Global/Middlewares/request-id.middleware';
import { RequestLoggerMiddleware } from './Global/Middlewares/request-logger.middleware';
// Service
import { ConfigKafkaModule } from './Config/Database/Kafka/config.module';
import { AuthModule } from './Models/V1/Auth/auth.module';
import { CommonModule } from './Models/V1/Common/common.module';
import { TestModule } from './Models/V1/Test/test.module';
import { RedisModule } from './Providers/Database/Redis/redis.module';
import { MailModule } from './Providers/Mail/mail.module';
import { SmsModule } from './Providers/Sms/sms.module';
import { CsvDownloadExample } from './Utils/DataFrame/csv.download.example';

const moduleImport = [
  ConfigApiModule,
  ConfigAppModule,
  ConfigKafkaModule,
  MulterModule.register({
    storage: memoryStorage()
  }),
  TestModule,
  AuthModule,
  CommonModule,
  AuthModule,
  RedisModule,
  SmsModule,
  MailModule,
  CsvDownloadExample
];

const envNow = process.env.APP_ENV
  ? process.env.APP_ENV.toUpperCase()
  : 'LOCAL';

if (envNow === 'DEV' || envNow === 'STAGE' || envNow === 'PROD') {
  moduleImport.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../client', 'build')
    })
  );
}

/**
 * Import and provide app related classes.
 *
 * @module
 */
@Module({
  imports: moduleImport,
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggerMiddleware, RequestIdMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL });
  }
}
