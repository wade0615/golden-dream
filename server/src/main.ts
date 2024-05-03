import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { VersioningType } from '@nestjs/common';
// import { version } from '../package.json';
import { ConfigAppService } from './Config/App/config.service';
import { AppModule } from './app.module';

import globalExceptionHandleFilter from './Global/ExceptionFilter/global.exception.handle.filter';
import globalInterceptor from './Global/Interceptors/global.interceptor';
import { GlobalDTOValidationPipe } from './Global/Pipes/global.dto.validation.pipe';
import { LogService } from './Utils/log.service';

async function bootstrap(): Promise<void> {
  console.log('Current env:', process.env.APP_ENV);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  // allow use image
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'https: data: blob:']
      }
    })
  );
  app.use(cookieParser());

  const appConfig: ConfigAppService = await app.get(ConfigAppService);

  // *******************上ＵＡＴ後要鎖 非常重要 ***************************
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, //設置是否傳送 cookie
    preflightContinue: false, //傳遞 OPTION 請求的 response 到下一個 handle
    optionsSuccessStatus: 204, //設置當 OPTION 請求成功時，回傳的 HTTP Code
    allowedHeaders: 'Content-Type,Authorization,refresh-token'
  });

  app.useGlobalPipes(new GlobalDTOValidationPipe());

  // Version control
  app.enableVersioning({
    type: VersioningType.URI
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new globalInterceptor(new LogService()));
  app.useGlobalFilters(new globalExceptionHandleFilter(new LogService()));

  // const v1Config = new DocumentBuilder()
  //   .setTitle(`${appConfig.name} V1`)
  //   .setDescription('V1 documentation')
  //   .setVersion(version)
  //   .addTag('accounts')
  //   .build();

  // Swagger only generate at local or dev
  // const NOW_ENV = process.env.APP_ENV;
  // if (NOW_ENV === 'LOCAL' || NOW_ENV === 'DEV') {
  //   const document = SwaggerModule.createDocument(app, v1Config);
  //   SwaggerModule.setup('/v1/swagger/api', app, document);
  // }

  const server = await app.listen(appConfig.port);
  server.keepAliveTimeout = appConfig.keepAliveTimeout;
  server.headersTimeout = appConfig.headersTimeout;
}
bootstrap();
