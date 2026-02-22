// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
//
// @Injectable()
// export class RefreshTokenGuard extends AuthGuard('refreshToken') {}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
