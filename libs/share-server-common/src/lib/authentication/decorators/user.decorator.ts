import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data, req) => req.user);
export const CurrentUserGQL = createParamDecorator((data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().user);
