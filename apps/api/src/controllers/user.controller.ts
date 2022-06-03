import { Get, Req, Param, Put, JsonController, Body } from 'routing-controllers';
import { Ipware } from '@fullerstack/nax-ipware';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ConfigService, UsersService } from '@balancer/utils-server/services';

@OpenAPI( {
  security: [],
} )
@JsonController( '/users' )
export class UserController {
  constructor(
    private configService: ConfigService ,
    private usersService: UsersService
  ) {  }
  readonly ipware = new Ipware();

}
