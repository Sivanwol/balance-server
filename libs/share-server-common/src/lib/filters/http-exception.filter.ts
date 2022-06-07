import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    try {
      response.status(status || 500).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
        stack: process.env.NODE_ENV === 'development' ? exception.stack : null,
        path: request.url,
      });
    } catch (e) {
      throw exception;
    }
  }
}
