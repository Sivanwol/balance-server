import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();
import { ServicesRoute } from '@balancer/utils-server/constraints/knownservices';
process.env['MICROSERVICE_Group'] = ServicesRoute.ConfigService
import { BaseApp } from '@balancer/utils-server/baseApp';
import { IndexController } from './controllers/index.controller';
import { ConfigController } from './controllers/config.controller';
class Server extends BaseApp {
  constructor( Controllers: Function[] ) {
    super( Controllers )
  }

  protected registerMQEvents(): [] {
    return [];
  }

  protected initializeExternalMiddlewares() {
    return;
  }

  protected setupExternalPassport() {
    return;
  }
}

function main() {
  const app = new Server( [IndexController, ConfigController] );
  app.listen();

}

main();
