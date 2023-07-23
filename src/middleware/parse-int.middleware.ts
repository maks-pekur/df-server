import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ParseIntMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ParseIntMiddleware.name);

  use(req: Request, _: Response, next: NextFunction) {
    this.logger.log('Pre-processing request data...');
    const keys = Object.keys(req.body);

    keys.forEach((key) => {
      if (!isNaN(req.body[key])) {
        req.body[key] = parseFloat(req.body[key]);
      }
    });
    this.logger.log('Post-processing request data:');
    this.logger.log(req.body);
    next();
  }
}
