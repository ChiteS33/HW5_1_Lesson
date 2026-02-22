import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { ObjectId } from 'mongodb';
import { settings } from '../../guards/strategies/constants';
import { DomainException } from '../../exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../exceptions/domain-exception-codes';
import { SessionsRepository } from '../../../sessions/repostiory/sessions.repository';

@Injectable()
export class JwtAdapter {
  constructor(
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {}

  createJWT(userId: string): string {
    return jwt.sign({ userId }, settings.JWT_SECRET, { expiresIn: '10s' });
  }

  createRefreshToken(
    userId: string,
    deviceId: string = new ObjectId().toString(),
  ): string {
    const payload = { userId: userId, deviceId: deviceId };
    return jwt.sign(payload, settings.JWT_REFRESH_TOKEN, { expiresIn: '20s' });
  }

  verifyRefreshToken(token: string): any {
    if (!token) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'Refresh token',
        message: 'Refresh token not found',
      });
    }

    return jwt.verify(token, settings.JWT_REFRESH_TOKEN);
  }

  decodeJWT(token: string): any {
    return jwtDecode(token);
  }
}
