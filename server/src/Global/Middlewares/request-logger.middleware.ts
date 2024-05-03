import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const NS_TO_MS = 1e6;
const MS_TO_S = 1e3;
const getDurationInMilliseconds = (start: bigint): number => {
  return Number(start) / NS_TO_MS;
};

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = getDurationInMilliseconds(process.hrtime.bigint());
    next();
    res.on('finish', () => {
      const end = getDurationInMilliseconds(process.hrtime.bigint());
      const ms = end - start;
      const s = ms / MS_TO_S;
      this.logger.log(
        `[${res.statusCode}] ${req.method} ${req.originalUrl} ${ms.toFixed(
          4,
        )} ms (${s.toFixed(2)} s)`,
      );
    });
  }
}
