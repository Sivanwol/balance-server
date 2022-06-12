import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Ipware } from '@fullerstack/nax-ipware';
const ipware = new Ipware();

export const RequesterIp = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  return ipware.getClientIP(ctx.getContext().req);
});
