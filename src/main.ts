import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3005;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  Logger.log(`API started on ${PORT}`);
}
bootstrap();
