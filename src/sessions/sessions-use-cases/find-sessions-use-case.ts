import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../repostiory/sessions.repository';
import { Inject } from '@nestjs/common';
import { JwtAdapter } from '../../core/adapters/jwtAdapter/jwt-adapter.service';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { Payload } from '../../common/types/common.types';
import { OutPutSessionDTO } from '../types/output-dto';

export class FindAllSessionsCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(FindAllSessionsCommand)
export class FindAllUsersUseCase implements ICommandHandler<FindAllSessionsCommand> {
  constructor(
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
    @Inject(JwtAdapter) private jwtAdapter: JwtAdapter,
  ) {}

  async execute(command: FindAllSessionsCommand): Promise<OutPutSessionDTO[]> {
    const payloadRefreshToken: Payload = this.jwtAdapter.decodeJWT(
      command.refreshToken,
    );
    const userId = payloadRefreshToken.userId;
    const foundSessions: OutPutSessionDTO[] =
      await this.sessionsRepository.findAllSessions(userId);
    if (!foundSessions) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'Refresh Token',
        message: 'Sessions not found',
      });
    }
    return foundSessions;
  }
}
