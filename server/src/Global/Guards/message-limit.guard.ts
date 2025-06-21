import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { GlobalVariableService } from '../GlobalVariable/global-variable';

import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@Injectable()
export class MessageLimitGuard implements CanActivate {
  constructor(private globalVariableService: GlobalVariableService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    if (!this.globalVariableService.canSendMessage(ip)) {
      throw new CustomerException(
        {
          code: 987987,
          // msg: '系統錯誤，請聯繫系統管理員。'
          msg: '講太多話了吧？明天再來吧！'
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
