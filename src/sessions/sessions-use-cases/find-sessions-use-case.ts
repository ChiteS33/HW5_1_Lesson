import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../repostiory/sessions.repository';
import { Inject } from '@nestjs/common';
import { JwtAdapter } from '../../core/adapters/jwtAdapter/jwt-adapter.service';
import { Payload } from '../../common/types/common.types';
import { SessionOutPut } from '../types/output-dto';

export class FindAllSessionsCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(FindAllSessionsCommand)
export class FindAllUsersUseCase implements ICommandHandler<FindAllSessionsCommand> {
  constructor(
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
    @Inject(JwtAdapter) private jwtAdapter: JwtAdapter,
  ) {}

  async execute(command: FindAllSessionsCommand): Promise<SessionOutPut[]> {
    const payloadRefreshToken: Payload = this.jwtAdapter.decodeJWT(
      command.refreshToken,
    );
    const userId = payloadRefreshToken.userId;
    return await this.sessionsRepository.findAllSessions(userId);
    // if (!foundSessions[0]) {
    //   throw new DomainException({
    //     code: DomainExceptionCode.NotFound,
    //     field: 'Refresh Token',
    //     message: 'Sessions not found',
    //   });
    // }
  }
}
