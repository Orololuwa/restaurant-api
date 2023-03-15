import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from './lib/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();

  await app.listen(PORT || 3000, () => {
    console.log(
      `App running on PORT: ${PORT || 3000}, ${process.env.NODE_ENV} mode`,
    );
  });
}

bootstrap();
