import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { DataSource } from 'typeorm';
import { Session } from './auth/entities/session.entity';
import { TypeormStore } from 'connect-typeorm';

async function bootstrap() {
  const PORT = +process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const sessionRepository = app.get(DataSource).getRepository(Session);
  app.enableCors({
    origin: ['http://localhost:3000'], // your origins array
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Accept, Authorization, X-Requested-With, Origin',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 3600000,
        httpOnly: false,
      },
      store: new TypeormStore({
        cleanupLimit: 10,
        limitSubquery: false,
      }).connect(sessionRepository),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT);
}
bootstrap();
