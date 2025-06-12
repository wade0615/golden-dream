import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

/**
 * HTTP 內容安全政策 (Content Security Policy) 中介層
 * 用於設定 HTTP 響應標頭，增強應用程式的安全性。
 */
@Injectable()
export class ContentSecurityPolicyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const contentSecurityPolicy = `
      default-src 'self';
      connect-src 'self' 
        https://my-app-684523256629.asia-east1.run.app
        https://gorgeous-wade.com
        https://taiwan-strait-observatory.vercel.app
        https://www.taiwan-strait-observatory.com
        https://taiwan-strait-observatory-wades-projects-1587a432.vercel.app
        https://www.googletagmanager.com
        https://www.google-analytics.com;
      script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
      script-src-elem 'self' https://www.googletagmanager.com https://www.google-analytics.com;
      font-src *;
      style-src * 'unsafe-inline';
      img-src * data:;
    `
      .trim()
      .replace(/\s{2,}/g, ' ');

    res.setHeader('Content-Security-Policy', contentSecurityPolicy);
    res.setHeader('X-Request-ID', v4());
    console.log('ContentSecurityPolicyMiddleware executed');
    next();
  }
}
