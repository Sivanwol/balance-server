/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();
import { PlatformServices } from '@prisma/client';
process.env['MICROSERVICE_Group'] = PlatformServices.API;

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import { checkAuthRoute } from '@balancer/utils-server/middlewares';
import { BaseApp } from '@balancer/utils-server/baseApp';
import { logger } from '@balancer/utils-server/utils/logger';
import { IndexController } from './controllers/index.controller';
import { publicSchema, secureSchema } from './graph-ql/schema';
class App extends BaseApp {
  constructor(Controllers: Function[]) {
    super(process.env.API_PORT, Controllers);
  }
  protected registerMQEvents(): [] {
    return [];
  }
  protected setupAuth() {
    // BindAuth0()
  }

  protected async initializeExternalMiddlewares() {
    const isProd = process.env.NODE_ENV === 'production';
    this.initializeWebSockets(isProd);
    await this.initializeGraphQL(isProd);
  }

  private initializeWebSockets(isProd: boolean) {
    this.initializeWebSocketsSecure(isProd);
    this.initializeWebSocketsPublic(isProd);
  }

  public initializeWebSocketsSecure(isProd: boolean) {
    // We wrap the express server so that we can attach the WebSocket for subscriptions
    const ws = createServer(this.app);

    ws.listen(process.env.API_WSPORT_SECURE, () => {
      logger.info(`=================================`);
      logger.info(`======= WS Secure =======`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`======= IS PROD: ${isProd} =======`);
      logger.info(`🚀 WS GraphQL Server is now running on http://0.0.0.0:${process.env.API_WSPORT_SECURE}`);
      logger.info(`=================================`);

      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema: secureSchema(),
        },
        {
          server: ws,
          path: 'ws/secure/subscriptions',
        }
      );
    });
  }

  public initializeWebSocketsPublic(isProd: boolean) {
    // We wrap the express server so that we can attach the WebSocket for subscriptions
    const ws = createServer(this.app);

    ws.listen(process.env.API_WSPORT_PUBLIC, () => {
      logger.info(`=================================`);
      logger.info(`======= WS Public =======`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`======= IS PROD: ${isProd} =======`);
      logger.info(`🚀 WS GraphQL Server is now running on http://0.0.0.0:${process.env.API_WSPORT_PUBLIC}`);
      logger.info(`=================================`);

      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema: publicSchema(),
        },
        {
          server: ws,
          path: 'ws/public/subscriptions',
        }
      );
    });
  }

  private async initializeGraphQL(isProd: boolean) {
    await this.initializeGraphQLSecure(isProd);
    await this.initializeGraphQLPublic(isProd);
  }

  private async initializeGraphQLSecure(isProd: boolean) {
    const server = new ApolloServer({
      schema: secureSchema(),
      debug: !isProd,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      // @ts-ignore
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.server })],
      validationRules: [depthLimit(parseInt(process.env.GRAPH_QL_MAX_DEPTH))],
    });
    server.applyMiddleware(checkAuthRoute);
    server.applyMiddleware({ app: this.app, path: '/api/secure' });
    await server.start();
  }

  private async initializeGraphQLPublic(isProd: boolean) {
    const server = new ApolloServer({
      schema: publicSchema(),

      debug: !isProd,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      // @ts-ignore
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.server })],
      validationRules: [depthLimit(parseInt(process.env.GRAPH_QL_MAX_DEPTH))],
    });
    server.applyMiddleware(checkAuthRoute);
    server.applyMiddleware({ app: this.app, path: '/api/public' });
    await server.start();
  }
}
function main() {
  const app = new App([IndexController]);
  app.listen();
}
main();
