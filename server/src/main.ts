// 引入 NestJS 核心模組，用於建立應用程式
import { NestFactory } from '@nestjs/core';
// 引入 Express 平台模組，用於建立 Express 應用程式
import { NestExpressApplication } from '@nestjs/platform-express';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// 引入 cookie-parser 模組，用於解析 cookies
import * as cookieParser from 'cookie-parser';
// 引入 helmet 模組，用於增強安全性
import * as helmet from 'helmet';

// 引入版本控制模組
import { VersioningType } from '@nestjs/common';
// import { version } from '../package.json';
// 引入應用程式設定服務
import { ConfigAppService } from './Config/App/config.service';
// 引入應用程式主模組
import { AppModule } from './app.module';

// 引入全域例外處理過濾器
import globalExceptionHandleFilter from './Global/ExceptionFilter/global.exception.handle.filter';
// 引入全域攔截器
import globalInterceptor from './Global/Interceptors/global.interceptor';
// 引入全域 DTO 驗證管道
import { GlobalDTOValidationPipe } from './Global/Pipes/global.dto.validation.pipe';
// 引入日誌服務
import { LogService } from './Utils/log.service';

// 定義應用程式啟動函式
async function bootstrap(): Promise<void> {
  // 輸出當前環境變數
  console.log('Current env:', process.env.APP_ENV);
  console.log('Current app name:', process.env.APP_NAME);
  console.log('Current app port:', process.env.APP_PORT);

  // 建立 NestJS 應用程式
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 設定 helmet 內容安全政策，允許使用圖片
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com'
        ],
        'script-src-elem': [
          "'self'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com'
        ],
        'img-src': [
          "'self'",
          'https: data: blob:',
          'data:',
          'blob:',
          'https://www.google-analytics.com',
          'https://stats.g.doubleclick.net'
        ],
        'connect-src': [
          "'self'",
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com'
        ]
      }
    })
  );
  // 使用 cookie-parser 解析 cookies
  app.use(cookieParser());

  // 獲取應用程式設定服務，專門讀取 .env 檔案的設定
  const appConfig: ConfigAppService = await app.get(ConfigAppService);

  // 設定 CORS 政策，允許跨域請求
  app.enableCors({
    origin: true, // 允許所有網域存取，若需限制可設定為特定網域或陣列，例如 ['https://example.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允許的 HTTP 方法
    credentials: true, // 允許跨域請求攜帶認證資訊（如 cookies、HTTP 認證）
    preflightContinue: false, // 當瀏覽器發送 OPTIONS 請求時，是否將請求傳遞到下一個處理程序
    optionsSuccessStatus: 204, // 當 OPTIONS 請求成功時，回傳的 HTTP 狀態碼（204 表示 No Content）
    allowedHeaders: 'Content-Type,Authorization,refresh-token' // 允許的 HTTP 標頭
  });

  // 使用全域 DTO 驗證管道
  app.useGlobalPipes(new GlobalDTOValidationPipe());

  // 啟用版本控制，使用 URI 版本控制（這很酷但現在都沒用到）
  app.enableVersioning({
    type: VersioningType.URI
  });

  // 設定全域路由前綴為 'api'
  app.setGlobalPrefix('api');
  // 使用全域攔截器
  app.useGlobalInterceptors(new globalInterceptor(new LogService()));
  // 使用全域例外處理過濾器（全域 error 處理過濾器）
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

  // 啟動應用程式，監聽指定埠號
  const server = await app.listen(appConfig.port || 8080);
  // 設定伺服器 keepAlive 超時時間
  server.keepAliveTimeout = appConfig.keepAliveTimeout;
  // 設定伺服器標頭超時時間
  server.headersTimeout = appConfig.headersTimeout;
}
// 呼叫啟動函式
bootstrap();
