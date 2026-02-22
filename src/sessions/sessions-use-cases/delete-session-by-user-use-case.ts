import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtAdapter } from '../../core/adapters/jwtAdapter/jwt-adapter.service';
import { SessionsService } from '../sessions.service';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { SessionsRepository } from '../repostiory/sessions.repository';

export class DeleteSessionByDeviceIdCommand {
  constructor(
    public deviceId: string,
    public refreshToken: string,
  ) {}
}

@CommandHandler(DeleteSessionByDeviceIdCommand)
export class DeleteSessionByDeviceIdUseCase implements ICommandHandler<DeleteSessionByDeviceIdCommand> {
  constructor(
    @Inject(JwtAdapter) private jwtAdapter: JwtAdapter,
    @Inject(SessionsService) private sessionService: SessionsService,
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {}

  async execute(command: DeleteSessionByDeviceIdCommand): Promise<void> {
    const payloadRefreshToken = this.jwtAdapter.decodeJWT(command.refreshToken);

    const foundSession = await this.sessionService.findSessionByDeviceId(
      command.deviceId,
    );
    console.log(foundSession);
    if (!foundSession) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'DeviceId',
        message: 'Session not found.',
      });
    }
    if (foundSession.userId !== payloadRefreshToken.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        field: 'refreshToken',
        message: 'User hasn`t rigths',
      });
    }

    await this.sessionsRepository.deleteSessionByDeviceId(command.deviceId);
    return;
  }
}
