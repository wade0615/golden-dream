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
import { ContentSecurityPolicyMiddleware } from './Global/Middlewares/contentSecurityPolicy.middleware';
import { RequestIdMiddleware } from './Global/Middlewares/request-id.middleware';
import { RequestLoggerMiddleware } from './Global/Middlewares/request-logger.middleware';

// Basic Service Setting
import { RedisModule } from './Providers/Database/Redis/redis.module';
// import { FirebaseModule } from './Providers/Database/Firestore/firebase.module';
// import { MailModule } from './Providers/Mail/mail.module';
// import { SmsModule } from './Providers/Sms/sms.module';
// import { CsvDownloadExample } from './Utils/DataFrame/csv.download.example';

// Service
// import { ConfigKafkaModule } from './Config/Database/Kafka/config.module';
import { AuthModule } from './Models/V1/Auth/auth.module';
import { CategoryModule as BackStageCategoryModule } from './Models/V1/BackStage/Category/category.module';
import { PostsModule as BackStagePostsModule } from './Models/V1/BackStage/Posts/posts.module';
import { CommonModule } from './Models/V1/Common/common.module';
import { PostsModule } from './Models/V1/Posts/posts.module';
import { TestModule } from './Models/V1/Test/test.module';
import { TSO_Module } from './Models/V1/TSO/tso.module';

import { ScheduleService } from 'src/Service/Basic/schedule.service';
import { LogService } from 'src/Utils/log.service';

// 排程 Schedule
import { TSO_Repository } from 'src/Service/TSO/tso.repository';
import { TSO_ScheduleService } from 'src/Service/TSO/tso.schedule';
import { TSO_Service } from 'src/Service/TSO/tso.service';
import { BatchScheduleService } from './Service/batchSchedule.service';

import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';

const moduleImport = [
  ConfigApiModule,
  ConfigAppModule,
  // ConfigKafkaModule,
  MulterModule.register({
    storage: memoryStorage()
  }),
  TestModule,
  PostsModule,
  AuthModule,
  CommonModule,
  AuthModule,
  BackStagePostsModule,
  BackStageCategoryModule,
  RedisModule,
  MysqlModule,
  TSO_Module
  // FirebaseModule
  // SmsModule,
  // MailModule,
  // CsvDownloadExample
];

const envNow = process.env.APP_ENV
  ? process.env.APP_ENV.toUpperCase()
  : 'LOCAL';

if (envNow === 'DEV' || envNow === 'STAGE' || envNow === 'PROD') {
  moduleImport.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client', 'build')
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
  providers: [
    AppService,
    LogService,
    ScheduleService,
    BatchScheduleService,
    TSO_ScheduleService,
    TSO_Service,
    TSO_Repository
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggerMiddleware, RequestIdMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL });
    consumer
      .apply(ContentSecurityPolicyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
