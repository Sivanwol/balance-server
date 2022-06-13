import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, req) => req.user);
export const CurrentUserGQL = createParamDecorator((data: unknown, ctx: ExecutionContext) => ctx.getArgs()[2].req.user);
