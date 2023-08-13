import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as express from 'express';

import path from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.use('/static', express.static(path.resolve(__dirname, '../static')));

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`));
}
bootstrap();
