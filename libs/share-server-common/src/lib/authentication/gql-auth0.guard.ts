import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedException } from '..';

@Injectable()
export class GqlAuth0Guard extends AuthGuard('auth0') {
  canActivate(context: ExecutionContext) {
    try {
      const graphqlContext = GqlExecutionContext.create(context);
      const [_, token] = graphqlContext.getContext().req.headers.authorization.split(' ');

      console.log(graphqlContext.getContext());
      if (token) return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  handleRequest(err, user, info) {
    console.log(err, user, info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
