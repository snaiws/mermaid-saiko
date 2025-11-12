import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from './api-response.dto';

/**
 * HTTP Exception Filter
 *
 * 모든 HTTP 예외를 통일된 형식으로 변환
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // NestJS가 자동 생성한 validation 에러 처리
    if (
      status === HttpStatus.BAD_REQUEST &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const validationErrors = exceptionResponse.message;

      const errorResponse = new ApiErrorResponse(
        'VALIDATION_ERROR',
        Array.isArray(validationErrors)
          ? validationErrors.join(', ')
          : String(validationErrors),
      );

      response.status(status).json(errorResponse);
      return;
    }

    // 커스텀 예외 처리
    if (typeof exceptionResponse === 'object' && 'code' in exceptionResponse) {
      const { code, message, details } = exceptionResponse as any;

      const errorResponse = new ApiErrorResponse(code, message, details);
      response.status(status).json(errorResponse);
      return;
    }

    // 기본 예외 처리
    const errorResponse = new ApiErrorResponse(
      'INTERNAL_SERVER_ERROR',
      exception.message,
    );

    response.status(status).json(errorResponse);
  }
}
