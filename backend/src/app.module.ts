import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { RenderingModule } from './api/rendering/rendering.module';
import { ExportModule } from './api/export/export.module';
import { HttpExceptionFilter } from './api/common/http-exception.filter';
import { AllExceptionsFilter } from './api/common/all-exceptions.filter';

@Module({
  imports: [InfrastructureModule, RenderingModule, ExportModule],
  providers: [
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // DTO에 정의되지 않은 속성 제거
        forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
        transform: true, // 자동 타입 변환
      }),
    },
    // Global Exception Filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
