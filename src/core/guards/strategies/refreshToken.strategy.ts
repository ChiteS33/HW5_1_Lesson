import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { settings } from './constants';
import { SessionsRepository } from '../../../sessions/repostiory/sessions.repository';
import { DomainException } from '../../exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../exceptions/domain-exception-codes';
import { Payload } from '../../../common/types/common.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: settings.JWT_REFRESH_TOKEN,
    });
  }

  async validate(payload: Payload) {
    const foundSession = await this.sessionsRepository.findSessionByDeviceId(
      payload.deviceId,
    );
    if (!foundSession) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'Refresh Token',
        message: 'Session not found.',
      });
    }

    if (foundSession.exp !== new Date(payload.exp * 1000).toISOString()) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'Refresh token',
        message: 'Refresh Token expired',
      });
    }

    return payload;
  }
}
