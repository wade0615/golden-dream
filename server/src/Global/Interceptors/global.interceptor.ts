import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ELK_LEVEL } from 'src/Definition/Enum/elk.level.enum';
import { STATE_CODE } from 'src/Definition/Enum/state.code.enum';
import { ELKLogObj } from 'src/Definition/Interface/Log/print.log.elk.third.party.interface';
import { LogService } from 'src/Utils/log.service';

export interface Response<T> {
  statusCode: number;
  timestamp: string;
  message: string;
  result: T;
}

/**
 * 全域攔截器，用於攔截所有 API 請求，並且印 log 到 local 資料夾，以及印 ELK log
 */
@Injectable()
export default class ApiInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    // const resp = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((result) => {
        // 印 log 在 local 資料夾
        // this.logService.printLogToLocal(req, result);

        // ELK 印 log 在 cmd
        const elkLogObj = <ELKLogObj>{};
        elkLogObj.status = 200;
        elkLogObj.code = STATE_CODE.SUCCESS;
        elkLogObj.level = ELK_LEVEL.INFO;
        elkLogObj.method = req?.method;
        elkLogObj.request = req?.body;
        elkLogObj.route = req?.originalUrl;
        elkLogObj.sourceIP =
          req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
        elkLogObj.service = process.env.APP_NAME;
        elkLogObj.response = result;
        this.logService.printELKLog(elkLogObj);

        return {
          statusCode: STATE_CODE.SUCCESS,
          timestamp: new Date().toISOString(),
          message: '呼叫成功，未發生錯誤。',
          result
        };
      })
    );
  }
}
