import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedException } from '..';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Injectable()
export class GqlAuth0Guard extends AuthGuard('auth0') {
  canActivate(context: ExecutionContext) {
    try {
      const graphqlContext = GqlExecutionContext.create(context);
      const { req } = graphqlContext.getContext();
      return super.canActivate(new ExecutionContextHost([req]));
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
