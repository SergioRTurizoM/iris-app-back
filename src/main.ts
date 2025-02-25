import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as serverless from 'serverless-http';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.includes('netlify.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
}

bootstrap();

export const handler = serverless(server, {
  request: (req, event) => {
    req.requestContext = event.requestContext;
  },
});
