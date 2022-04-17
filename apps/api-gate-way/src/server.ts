/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();
import { ServicesRoute } from '@balancer/utils-server/constraints/knownservices';
process.env['MICROSERVICE_Group'] = ServicesRoute.APIGateWay

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import depthLimit from 'graphql-depth-limit';
import { createServer, Server } from 'http';
import schema from './graph-ql/schema';
import { BindJWTAUth } from './passport/jwt';
import { BindLocalAUth } from './passport/local';
import { BaseApp } from '@balancer/utils-server/baseApp';
import { logger } from '@balancer/utils-server/utils/logger';
import { IndexController } from './controllers/index.controller';
class App extends BaseApp {
  constructor(Controllers: Function[]) {
    super(Controllers)
  }
  protected registerMQEvents(): [] {
    return [];
  }
  protected setupExternalPassport() {
    BindLocalAUth()
    BindJWTAUth()
  }

  protected async initializeExternalMiddlewares() {
    this.initializeWebSockets()
    await this.initializeGraphQL()
  }

  private initializeWebSockets() {
    // We wrap the express server so that we can attach the WebSocket for subscriptions
    const ws = createServer( this.app );

    ws.listen( process.env.WSPORT, () => {
      logger.info( `=================================` );
      logger.info( `======= ENV: ${this.env} =======` );
      logger.info( `🚀 WS GraphQL Server is now running on http://0.0.0.0:${process.env.WSPORT}` );
      logger.info( `=================================` );

      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
        },
        {
          server: ws,
          path: '/subscriptions',
        },
      );
    } );
  }

  private async initializeGraphQL() {
    const server = new ApolloServer( {
      schema,
      debug: process.env.NODE_ENV === 'development',
      tracing: process.env.NODE_ENV === 'development',
      playground: process.env.NODE_ENV === 'development',
      introspection: true,
      context: ( {req, res} ) => ({req, res}),
      // @ts-ignore
      plugins: [ApolloServerPluginDrainHttpServer( {httpServer: this.server} )],
      validationRules: [depthLimit( parseInt( process.env.GRAPH_QL_MAX_DEPTH ) )]
    } )
    await server.start();
    server.applyMiddleware({app: this.app})
  }

}
function main() {
  const app = new App([IndexController]);
  app.listen();

}
main();
