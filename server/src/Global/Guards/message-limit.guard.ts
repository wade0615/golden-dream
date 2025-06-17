import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlobalVariableService } from '../GlobalVariable/global-variable';

@Injectable()
export class MessageLimitGuard implements CanActivate {
  constructor(private globalVariableService: GlobalVariableService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    if (!this.globalVariableService.canSendMessage(ip)) {
      throw new HttpException(
        'Message limit exceeded. Please try again tomorrow.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}