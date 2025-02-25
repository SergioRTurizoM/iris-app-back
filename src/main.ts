import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as serverless from 'serverless-http';
import { AllExceptionsFilter } from './common/all-exceptions.fIlter';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.init();
}

bootstrap();

export const handler = serverless(server);
