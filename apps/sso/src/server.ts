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
    super(process.env.SSO_PORT,Controllers)
  }
  protected registerMQEvents(): [] {
    return [];
  }
  protected setupAuth() {
    this.app.use(
      auth({
        issuerBaseURL: process.env.AUTH0_DOMAIN,
        baseURL: process.env.SSO_Host,
        clientID: process.env.AUTH0_CLIENT_ID,
        secret: process.env.AUTH0_CLIENT_SECRET,
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
