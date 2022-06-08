import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedException } from '..';

@Injectable()
export class GqlAuth0Guard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    try {
      const graphqlContext = GqlExecutionContext.create(context);
      console.log(graphqlContext.getContext().req);
      const [_, token] = graphqlContext
        .getContext()
        .req.headers.authorization.split(' ');
      if (token) return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
