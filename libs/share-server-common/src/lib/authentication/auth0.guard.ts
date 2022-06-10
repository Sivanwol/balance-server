import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

@Injectable()
export class Auth0Guard extends AuthGuard('auth0') implements IAuthGuard {
  canActivate(context: ExecutionContext) {
    console.log(context);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log(err, user, info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
