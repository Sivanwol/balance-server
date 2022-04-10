import { Get, Req, Param, Put, JsonController, Body } from 'routing-controllers';
import { Ipware } from '@fullerstack/nax-ipware';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ConfigService, UsersService } from '@wolberg-pro-games/utils-server/services';
import { TwoWayAuthType } from '@wolberg-pro-games/utils-server/utils/types';
import { ForgetPasswordUserDto } from '@wolberg-pro-games/utils-server/dtos/users.dto';

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
