import { Get, JsonController, UseBefore, Params, Res, Post, Req } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import { checkAuth } from '@balancer/utils-server/middlewares/auth.middleware';
@OpenAPI( {
  security: [],
} )
@Service()
@JsonController( '/' )
export class IndexController {
  constructor(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) { }

  @Get('/')
  index(@Res() res: any , @Req() req:any) {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
  }

  @Get('callback')
  callback(@Res() res: any , @Req() req:any) {
    res.send({...req.oidc , ...req.data})
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
  @Post('register')
  registerUser() {
    return 'Ok'
  }
  @Get('auth-test')
  @UseBefore(checkAuth)
  testAuth() {
    return 'OK'
  }
}
