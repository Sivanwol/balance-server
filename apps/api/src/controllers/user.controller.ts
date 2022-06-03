import { Get, Req, Param, Put, JsonController, Body, Post, UseBefore } from 'routing-controllers';
import { Ipware } from '@fullerstack/nax-ipware';
import { OpenAPI } from 'routing-controllers-openapi';
import { ConfigService, UsersService } from '@balancer/utils-server/services';
import { RegisterUserAuth0Dto } from '@balancer/utils-server/dtos/users.dto';
import { checkAuthRoute } from '@balancer/utils-server/middlewares/auth.middleware';
import { verifyMaintenanceMode } from '@balancer/utils-server/middlewares/veirfy-maintenance-mode.middeware';
import { authExternalApiServices } from '@balancer/utils-server/middlewares/auth-external-api-services.middleware';
@OpenAPI( {
  security: [
    {
      // bearerAuth: [],
      verifyServiceCode: [],
    },
  ],
} )
@JsonController( '/users' )
export class UserController {
  constructor(
    private configService: ConfigService ,
    private usersService: UsersService
  ) {  }
  readonly ipware = new Ipware();

  @Post('register/:userId')
  @OpenAPI({
    summary: 'post register feedback from auth0 of register new user',
    security: [
      {
        verifyServiceCode: [],
      },
    ],
  })
  @UseBefore(authExternalApiServices)
  async register(
    @Param('userId') userId: string,
    @Body() user: RegisterUserAuth0Dto
  ) {
    return await this.usersService.registerUser(userId, user);
  }

}
