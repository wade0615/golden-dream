import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { ThirdRoute } from 'src/Config/third';
import { ELK_LEVEL } from 'src/Definition/Enum/elk.level.enum';
import { STATE_CODE } from 'src/Definition/Enum/state.code.enum';
import { ELKLogObj } from 'src/Definition/Interface/Log/print.log.elk.third.party.interface';
import { LogService } from 'src/Utils/log.service';

/**
 * 全域例外處理過濾器，用於處理所有例外，並且印 log 到 ELK
 */
@Catch()
export default class GlobalExceptionHandleFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}
  catch(exception, host: ArgumentsHost) {
    const isCust = exception instanceof CustomerException;
    const isHttp = exception instanceof HttpException;

    const ctx = host.switchToHttp();
    const resp = ctx.getResponse();
    const req = ctx.getRequest();
    const elkLogObj = <ELKLogObj>{};

    //print elk log
    if (isCust) {
      const errorCode = exception.getErrorCode();
      const errorMsg = exception.getErrorMessage();
      const realErrorMsg = exception.getErrorResult<{ msg; isHide }>()?.msg;

      elkLogObj.status = resp?.statusCode;
      elkLogObj.code = errorCode;
      elkLogObj.level = ELK_LEVEL.WARN;
      elkLogObj.method = req?.method;
      elkLogObj.request = req?.body;
      elkLogObj.route = req?.originalUrl;
      elkLogObj.sourceIP =
        req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
      elkLogObj.msg = realErrorMsg ?? errorMsg?.msg;
      elkLogObj.service = process.env.APP_NAME;
      this.logService.printELKLog(elkLogObj);

      customerErrorProcess(exception, host);
    } else if (isHttp) {
      const status = exception.getStatus();
      const errorMsg = exception.message;

      elkLogObj.status = resp?.statusCode;
      elkLogObj.code = status;
      elkLogObj.level = ELK_LEVEL.WARN;
      elkLogObj.method = req?.method;
      elkLogObj.request = req?.body;
      elkLogObj.route = req?.originalUrl;
      elkLogObj.sourceIP =
        req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
      elkLogObj.msg = errorMsg;
      elkLogObj.service = process.env.APP_NAME;
      this.logService.printELKLog(elkLogObj);

      httpErrorProcess(exception, host);
    } else {
      const errorMsg = exception.message;

      elkLogObj.status = resp?.statusCode;
      elkLogObj.code = STATE_CODE.UNEXPECTED;
      elkLogObj.level = ELK_LEVEL.ERROR;
      elkLogObj.method = req?.method;
      elkLogObj.request = req?.body;
      elkLogObj.route = req?.originalUrl;
      elkLogObj.sourceIP =
        req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
      elkLogObj.msg = errorMsg;
      elkLogObj.service = process.env.APP_NAME;
      this.logService.printELKLog(elkLogObj);

      ErrorProcess(exception, host);
    }
  }
}

const httpErrorProcess = (exception: HttpException, host: ArgumentsHost) => {
  const ctx = host.switchToHttp();
  const resp = ctx.getResponse();
  const req = ctx.getRequest();
  const status = exception.getStatus();
  // http error just log message
  const apiPath = req?.originalUrl.split('/');
  if (!ThirdRoute.includes(`${apiPath[2]}/${apiPath[3]}`)) {
    resp.status(status).json({
      statusCode: STATE_CODE.UNEXPECTED,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      result: {
        msg: configError._200002.msg
      }
    });
  } else {
    resp.status(status).json({
      ResultCode: -1,
      ResponseText: configError._200002.msg,
      Exception: '',
      Content: ''
    });
  }
};

const customerErrorProcess = (exception, host: ArgumentsHost) => {
  const ctx = host.switchToHttp();
  const resp = ctx.getResponse();
  const req = ctx.getRequest();
  const status = exception.getStatus();
  const additionalError = exception.getErrorResult();
  const additional = additionalError?.isHide ? {} : additionalError;
  resp.status(status).json({
    statusCode: exception.getErrorCode(),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    result: {
      ...exception.getErrorMessage(),
      ...additional
    }
  });
};

const ErrorProcess = (exception, host: ArgumentsHost) => {
  const ctx = host.switchToHttp();
  const resp = ctx.getResponse();
  const req = ctx.getRequest();
  const status = HttpStatus.BAD_REQUEST;

  const apiPath = req?.originalUrl.split('/');
  if (!ThirdRoute.includes(`${apiPath[2]}/${apiPath[3]}`)) {
    resp.status(status).json({
      statusCode: STATE_CODE.UNEXPECTED,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      result: {
        msg: configError._200002.msg
      }
    });
  } else {
    resp.status(status).json({
      ResultCode: -1,
      ResponseText: configError._200002.msg,
      Exception: '',
      Content: ''
    });
  }
};

export class CustomerException extends HttpException {
  private errorVaule;

  constructor(errorVaule, statusCode: HttpStatus) {
    super(errorVaule, statusCode);
    this.errorVaule = errorVaule;
  }

  getErrorCode(): number {
    return this.errorVaule.code;
  }

  getErrorResult<T>(): T {
    return this.errorVaule.additional;
  }

  getErrorMessage(): { msg } {
    return { msg: this.errorVaule.msg };
  }
}
