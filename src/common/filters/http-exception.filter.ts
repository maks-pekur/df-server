import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseError } from '../interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(error: ResponseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `Exception thrown on request to ${request.url}`,
      error.stack,
    );

    if (error instanceof HttpException) {
      response.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: error.message,
        error: error.name,
      });
    } else {
      const status = error?.statusCode || 500;
      response.status(status).json({
        statusCode: status,
        message: error.message,
        path: request.url,
        error: 'Internal Server Error',
      });
    }
  }
}
