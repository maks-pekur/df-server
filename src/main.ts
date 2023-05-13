import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.enableCors();
  // app.use(
  //   session({
  //     secret: 'keyword',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(5000);
}
bootstrap();
