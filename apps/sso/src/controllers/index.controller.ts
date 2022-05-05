import { Get, JsonController, UseBefore, Params, Res, Post, Req, Param, Body } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import { checkAuth } from '@balancer/utils-server/middlewares/auth.middleware';
import { authExternalApiServices } from '@balancer/utils-server/middlewares/auth-external-api-services.middleware'
import { RegisterUserAuth0Dto } from '@balancer/utils-server/dtos/users.dto';
import { UsersService } from '@balancer/utils-server/services';
@OpenAPI( {
  security: [{
  }],
} )
@Service()
@JsonController( '/' )
export class IndexController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private usersService: UsersService
  ) { }

  @Post('register/user/:userId')
  @OpenAPI( {summary: 'post register feedback from auth0 of register new user',
  security: [{
    'X-SERVICE-API-KEY': ['service code']
  }]} )
  @UseBefore(authExternalApiServices)
  async register(@Param('userId') userId: string, @Body() user: RegisterUserAuth0Dto) {
    user.userId = userId;
    return await this.usersService.registerUser(user);
  }

  @Get('signup/:page')
  signup(@Res() res: any , @Params() params:any) {
    const {page} = params;
    res.oidc.login({
      returnTo: page,
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
  @Get('auth-test')
  @UseBefore(checkAuth)
  testAuth() {
    return 'OK'
  }
}
