/* eslint-disable @typescript-eslint/ban-types */
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import passport from 'passport';
import morgan from 'morgan';
import {
  Action,
  getMetadataArgsStorage,
  useContainer,
  useExpressServer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typedi';
import { logger, stream } from './utils/logger';
import { ServerEvents } from './constraints/serverEvents';
import { RabbitMQConnection } from './utils/RabbitMQConnection';
import errorMiddleware from './middlewares/error.middleware';
import { BaseEvent } from './events/BaseEvent';
import { createServer, Server } from 'http';
import { RequestMethod, RequestService } from './services/request.service';
import { ServicesRoute } from './constraints/knownservices';
import { PlatformSettingsListResponse } from './responses/PlatformSettingsResponse';
import { ConfigService } from './services/config.service';
import { ConfigUnableToLoadException } from './exceptions/ConfigUnableToLoadException';
import { EventEmitter } from 'events';
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express from 'express';

if (process.env.NEWRELIC_ENABLE === '1') {
  require('./newrelic');
}
export const newrelic =
  process.env.NEWRELIC_ENABLE === '1' ? require('newrelic') : null;
export abstract class BaseApp {
  protected app: express.Application;
  protected readonly server: Server;
  protected port: string | number;
  protected env: string;
  protected onServerEvents: EventEmitter = new EventEmitter();
  protected constructor(port, Controllers: Function[]) {
    this.app = express();
    this.server = createServer(this.app);
    this.port = port;
    this.env = process.env.NODE_ENV || 'development';
    this.onServerEvents.emit(ServerEvents.Preload);
    process.on('exit', (code) => {
      console.log(`About to exit with code: ${code}`);
      this.onServerEvents.emit(ServerEvents.Exit);
    });
    this.initServer(Controllers).finally(() =>
      console.log('Server up and running')
    );
  }
  private async initServer(Controllers: Function[]) {
    await this.initializeMessageBrokerHandling();
    this.initializeMiddlewares();
    this.initializeExternalMiddlewares();
    if (process.env.MICROSERVICE_Group !== ServicesRoute.ConfigService)
      await this.requestServiceConfig();
    this.initializeMiddlewaresAuth();
    this.initializeRoutes(Controllers);
    this.initializeSwagger(Controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.onServerEvents.emit(ServerEvents.StartWeb);
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async requestServiceConfig() {
    const configService = Container.get(ConfigService);
    const requester = new RequestService();
    requester.initRequest(ServicesRoute.ConfigService);
    console.log(`Request config data`)
    const payload = await requester.request(
      RequestMethod.GET,
      'config/sync/service'
    );
    if (payload && payload.status === 200 && payload.data) {
      const data = payload.data as PlatformSettingsListResponse;
      console.log(`recived config data ${JSON.stringify(payload.data)}`)
      if (data.status) {
        const configs = data.data.items;
        await configService.SetServiceSettings(configs);
        return;
      }
      logger.info('Unable load Config');
      logger.error(data.errors.join('\n\r'));
      throw new ConfigUnableToLoadException();
    } else {
      throw new ConfigUnableToLoadException();
    }
  }
  protected abstract initializeExternalMiddlewares();
  /***
   * register Rabbit mq queue message event
   * @protected
   */
  protected abstract registerMQEvents(): BaseEvent[];
  protected async initializeMessageBrokerHandling() {
    RabbitMQConnection.getInstance().RegisterEventsList =
      this.registerMQEvents();
    await RabbitMQConnection.getInstance().OpenConnection();
    process.on('beforeExit', async () => {
      await RabbitMQConnection.getInstance().CloseConnection();
    });
    await RabbitMQConnection.getInstance().LoadEvents();
  }

  protected abstract setupAuth();

  private initializeMiddlewaresAuth() {
    // this.app.use( session() )
    this.setupAuth();
    this.app.use(passport.initialize());
    // this.app.use(passport.session());
  }
  private initializeMiddlewares() {
    this.app.use(morgan(process.env.LOGFormat, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(controllers: Function[]) {
    useContainer(Container);
    useExpressServer(this.app, {
      cors: {
        origin: process.env.CORSOrigin,
        credentials: process.env.CORSCredentials,
      },
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const routingControllersOptions = {
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-ACCESS-KEY',
          },
        },
      },
      info: {
        description: 'Balancer System Api System',
        title: 'Balancer System',
        version: '1.0.0',
      },
    });

    if (process.env.NODE_ENV === 'development')
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
