/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, RedisOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
dotenv.config();

declare const module: any;
async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'development'
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
  });
  const micorServiceConnection = await app.connectMicroservice<RedisOptions>({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
      retryAttempts: 5,
      retryDelay: 500
    },
  }, { inheritAppConfig: true });
  app.use(helmet());
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.API_VERSION,
    prefix: 'api/v',
  });
  app.startAllMicroservices();
  if (isDev) {
    const config = new DocumentBuilder()
    .setTitle('Api Services')
    .setDescription('Api Services Document')
    .setVersion(process.env.API_VERSION)
    .addTag('api')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(+process.env.API_PORT || 3333);
  Logger.log(`🚀 Application is running [${process.env.NODE_ENV}] service Version [${process.env.API_VERSION}] on: http://0.0.0.0:${+process.env.API_PORT || 3333}/api/v${process.env.API_VERSION}`);
  if (isDev && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    Logger.log('Reloading Server')
  }
}

bootstrap();
