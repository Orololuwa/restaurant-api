import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from './lib/config/app.config';
import { AllExceptionsFilter } from './core/interceptors/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors();

  await app.listen(PORT || 3000, () => {
    console.log(
      `App running on PORT: ${PORT || 3000}, ${process.env.NODE_ENV} mode`,
    );
  });
}

bootstrap();
