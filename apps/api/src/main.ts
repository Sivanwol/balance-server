/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, RedisOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import pkg from '../../../package.json';
dotenv.config();

declare const module: any;
async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'development'
  const app = await NestFactory.create(AppModule);
  const micorServiceConnection = await app.connectMicroservice<RedisOptions>({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
      retryAttempts: 5,
      retryDelay: 500
    },
  }, { inheritAppConfig: true });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*'
  })
  app.startAllMicroservices();
  if (isDev) {
    const config = new DocumentBuilder()
    .setTitle('Api Services')
    .setDescription('Api Services Document')
    .setVersion(pkg.version)
    .addTag('api')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(+process.env.API_PORT || 3333);
  Logger.log(`🚀 Application is running [${process.env.NODE_ENV}] on: http://0.0.0.0:${port}/${globalPrefix}`);
  if (isDev && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();