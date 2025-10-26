import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from './api-response.dto';

/**
 * All Exceptions Filter
 *
 * 처리되지 않은 모든 예외를 잡아서 500 에러로 변환
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('Unhandled exception:', exception);

    const errorResponse = new ApiErrorResponse(
      'INTERNAL_SERVER_ERROR',
      exception instanceof Error
        ? exception.message
        : 'An unexpected error occurred',
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
