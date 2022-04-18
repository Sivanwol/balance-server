/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { auth } from 'express-openid-connect';

dotenv.config();
import { ServicesRoute } from '@balancer/utils-server/constraints/knownservices';
process.env['MICROSERVICE_Group'] = ServicesRoute.SSO
import { BaseApp } from '@balancer/utils-server/baseApp';
import { IndexController } from './controllers/index.controller';
class App extends BaseApp {
  constructor(Controllers: Function[]) {
    super(Controllers)
  }
  protected registerMQEvents(): [] {
    return [];
  }
  protected setupAuth() {
    this.app.use(
      auth({
        issuerBaseURL: 'https://YOUR_DOMAIN',
        baseURL: 'https://YOUR_APPLICATION_ROOT_URL',
        clientID: 'YOUR_CLIENT_ID',
        secret: 'LONG_RANDOM_STRING',
        idpLogout: true,
      })
    );
  }

  protected async initializeExternalMiddlewares() {
    return;
  }


}
function main() {
  const app = new App([IndexController]);
  app.listen();

}
main();
