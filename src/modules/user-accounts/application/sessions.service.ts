import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { SessionsRepository } from '../repositories/sessionRepositories/sessions.repository';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {}

  async findSessionByDeviceId(deviceId: string) {
    const foundSession =
      await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'deviceId',
        message: 'Session not found',
      });
    }
    return foundSession;
  }
}
