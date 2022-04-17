import { Get, Req, Param, Put, JsonController, Body } from 'routing-controllers';
import { Ipware } from '@fullerstack/nax-ipware';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ConfigService, UsersService } from '@balancer/utils-server/services';
import { TwoWayAuthType } from '@balancer/utils-server/utils/types';
import { ForgetPasswordUserDto } from '@balancer/utils-server/dtos/users.dto';

@OpenAPI( {
  security: [],
} )
@Service()
@JsonController( '/users' )
export class UserController {
  constructor(
    private configService: ConfigService ,
    private usersService: UsersService
  ) {  }
  readonly ipware = new Ipware();
  @Get('callback/auth')
  @OpenAPI( {summary: 'call back from auth0 user auth'})
  public authCallback() {
      passport.authenticate("auth0", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          const returnTo = req.session.returnTo;
          delete req.session.returnTo;
          res.redirect(returnTo || "/");
        });
      })(req, res, next);
  }
  @Get( '/email_confirm/:hashVerifyRequestId/:hashUserId/:hashCode' )
  @OpenAPI( {summary: 'confirm user email'} )
  public async confirmEmail(
    @Param( 'hashVerifyRequestId' ) hashVerifyRequestId: string,
    @Param( 'hashUserId' ) hashUserId: string,
    @Param( 'hashCode' ) hashCode: string,
    @Req() request: any ) {
    const ip = this.ipware.getClientIP( request )
    const status = await this.usersService.confirmEmailVerifyRequest( TwoWayAuthType.Email, hashVerifyRequestId, hashUserId, hashCode, ip )
    return {status};
  }

  @Get('/forgetpass_confirm/:hashVerifyRequestId/:hashUserId/:hashCode')
  @OpenAPI( {summary: 'confirm forget password request'} )
  public async confirmRequestForgetPassword(
    @Param( 'hashVerifyRequestId' ) hashVerifyRequestId: string,
    @Param( 'hashUserId' ) hashUserId: string,
    @Param( 'hashCode' ) hashCode: string,
    @Req() request: any ) {
    const ip = this.ipware.getClientIP( request )
    const status = await this.usersService.configForgetPasswordRequest( hashVerifyRequestId, hashUserId, hashCode, ip )
    return {status};
  }

  @Put('/forgetpass_change/:hashVerifyRequestId/:hashUserId/:hashCode')
  @OpenAPI( {summary: 'confirm forget password request'} )
  public async changeForgetPassword(
    @Param( 'hashVerifyRequestId' ) hashVerifyRequestId: string,
    @Param( 'hashUserId' ) hashUserId: string,
    @Param( 'hashCode' ) hashCode: string,
    @Body() userPassowrd: ForgetPasswordUserDto,
    @Req() request: any ) {
    const ip = this.ipware.getClientIP( request )
    let status = await this.usersService.configForgetPasswordRequest( hashVerifyRequestId, hashUserId, hashCode, ip )
    if (status) {
      status = await this.usersService.changeUserPassword(hashVerifyRequestId , hashUserId , ip , userPassowrd.password)
    }
    return {status};
  }

}
