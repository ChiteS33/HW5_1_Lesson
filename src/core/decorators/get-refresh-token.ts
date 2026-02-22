import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenDto } from '../../users/users.entity';
import { validate, validateOrReject } from 'class-validator';

export const GetRefreshToken = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const RefToken = new RefreshTokenDto();
    RefToken.refreshToken = request.cookies?.refreshToken as string;
    await validateOrReject(RefToken);
    return RefToken;
  },
);
