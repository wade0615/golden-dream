import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ContentSecurityPolicyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self' https://wade-personal.de.r.appspot.com https://gorgeous-wade.com; script-src 'self'; style-src *; img-src * data:;"
    );
    console.log('ContentSecurityPolicyMiddleware executed');
    next();
  }
}
