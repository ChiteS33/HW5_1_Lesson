import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../core/adapters/jwtAdapter/jwt-adapter.service';
import { Inject } from '@nestjs/common';
import { SessionsRepository } from '../../sessions/repostiory/sessions.repository';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { Payload } from '../../common/types/common.types';
import { PairTokens } from '../types/auth.types';

export class RefreshTokensCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase implements ICommandHandler<RefreshTokensCommand> {
  constructor(
    @Inject(JwtAdapter) private jwtAdapter: JwtAdapter,
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {}
  async execute(command: RefreshTokensCommand): Promise<PairTokens> {
    const payloadRefreshToken: Payload = this.jwtAdapter.decodeJWT(
      command.refreshToken,
    );
    const accessToken = this.jwtAdapter.createJWT(payloadRefreshToken.userId);
    const refreshToken = this.jwtAdapter.createRefreshToken(
      payloadRefreshToken.userId,
      payloadRefreshToken.deviceId,
    );
    const newPayload = this.jwtAdapter.decodeJWT(refreshToken);
    const newIat = newPayload.iat;
    const newExp = newPayload.exp;
    const foundSession = await this.sessionsRepository.findSessionByDeviceId(
      payloadRefreshToken.deviceId,
    );
    if (!foundSession) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'refreshToken',
        message: 'Session not found',
      });
    }

    foundSession.updateSession(newIat, newExp);
    await this.sessionsRepository.save(foundSession);
    return { accessToken, refreshToken };
  }
}
