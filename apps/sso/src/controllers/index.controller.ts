import {
  Get,
  JsonController,
  UseBefore,
  Params,
  Res,
  Post,
  Req,
  Param,
  Body,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import { checkAuthRoute } from '@balancer/utils-server/middlewares/auth.middleware';
import { verifyMaintenanceMode } from '@balancer/utils-server/middlewares/veirfy-maintenance-mode.middeware';
import { authExternalApiServices } from '@balancer/utils-server/middlewares/auth-external-api-services.middleware';
import { RegisterUserAuth0Dto } from '@balancer/utils-server/dtos/users.dto';
import { UsersService } from '@balancer/utils-server/services';
@OpenAPI({
  security: [
    {
      bearerAuth: [],
      verifyServiceCode: [],
    },
  ],
})
@Service()
@JsonController('/')
export class IndexController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private usersService: UsersService) {}

  @Post('register/user/:userId')
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

  @Get('signup/:page')
  signup(@Res() res: any, @Params() params: any) {
    const { page } = params;
    res.oidc.login({
      returnTo: page,
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
  @Get('auth-test')
  @OpenAPI({
    summary: 'auth test route',
    security: [
      {
        bearerAuth: [],
        verifyServiceCode: [],
      },
    ],
  })
  @UseBefore(verifyMaintenanceMode)
  @UseBefore(checkAuthRoute)
  testAuth() {
    return 'OK';
  }
  @Get('noauth-test')
  @OpenAPI({
    summary: 'none auth test route',
    security: [
      {
        verifyServiceCode: [],
      },
    ],
  })
  @UseBefore(verifyMaintenanceMode)
  testNoAuth() {
    return 'OK';
  }
}
