import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Static files 설정 (폰트 파일 서빙)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // CORS 설정 (프론트엔드에서 접근 가능하도록)
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:8080', // Docker nginx
      process.env.FRONTEND_URL,
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
