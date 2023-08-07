import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EmojiLogger } from './emoji-logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new EmojiLogger();

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(
        `${method} ** ${originalUrl} ** Status: ${statusCode} ** ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
