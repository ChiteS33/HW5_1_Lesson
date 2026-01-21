import { Inject } from '@nestjs/common';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../core/adapters/emailAdapter/email-adapter';

export class RecoveryPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryPasswordUseCase implements ICommandHandler<RecoveryPasswordCommand> {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(EmailAdapter) private emailAdapter: EmailAdapter,
  ) {}

  async execute(command: RecoveryPasswordCommand): Promise<void> {
    const foundUser = await this.usersRepository.findUserByLoginOrEmail(
      command.email,
    );
    if (!foundUser) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'email',
        message: 'Invalid email',
      });
    }
    foundUser.recoveryCode();
    await this.usersRepository.save(foundUser);
    await this.emailAdapter.resendEmail(
      command.email,
      foundUser.recoveryData.recoveryCode!,
    );
    return;
  }
}
