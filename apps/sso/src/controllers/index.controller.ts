import { Get, JsonController, UseBefore, Params, Res, Post } from 'routing-controllers'
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
  index() {
    return 'OK';
  }

  @Get('/signup/:page')
  public signup(@Res() res: any , @Params() params:any) {
    const {page} = params;
    res.oidc.login({
      returnTo: page,
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
  @Post('/register')
  public registerUser() {
    return 'Ok'
  }
  @Get('/auth-test')
  @UseBefore(checkAuth)
  public testAuth() {
    return 'OK'
  }
}
