import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ContentSecurityPolicyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const contentSecurityPolicy = `
      default-src 'self';
      connect-src 'self' https://my-app-684523256629.asia-east1.run.app https://gorgeous-wade.com https://www.googletagmanager.com https://www.google-analytics.com;
      script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
      script-src-elem 'self' https://www.googletagmanager.com https://www.google-analytics.com;
      font-src *;
      style-src * 'unsafe-inline';
      img-src * data:;
    `
      .trim()
      .replace(/\s{2,}/g, ' ');

    res.setHeader('Content-Security-Policy', contentSecurityPolicy);

    // res.setHeader(
    //   'Content-Security-Policy',
    //   "default-src 'self'; connect-src 'self' https://my-app-684523256629.asia-east1.run.app https://gorgeous-wade.com https://www.googletagmanager.com https://www.google-analytics.com; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; script-src-elem 'self' https://www.googletagmanager.com https://www.google-analytics.com; font-src *; style-src * 'unsafe-inline'; img-src * data:;"
    // );
    console.log('ContentSecurityPolicyMiddleware executed');
    next();
  }
}
