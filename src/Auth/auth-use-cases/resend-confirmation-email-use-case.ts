import { Inject } from '@nestjs/common';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../core/adapters/emailAdapter/email-adapter';

export class ResendEmailResendingEmailCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendEmailResendingEmailCommand)
export class ResendEmailResendingEmailUseCase implements ICommandHandler<ResendEmailResendingEmailCommand> {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(EmailAdapter) private emailAdapter: EmailAdapter,
  ) {}

  async execute(command: ResendEmailResendingEmailCommand): Promise<void> {
    const foundUser = await this.usersRepository.findUserByLoginOrEmail(
      command.email,
    );
    if (!foundUser) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'email',
        message: 'Invalid email',
      });
    }
    if (foundUser.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'email',
        message: 'Email is confirmed',
      });
    }
    foundUser.refreshConfirmationCode();
    await this.usersRepository.save(foundUser);
    await this.emailAdapter.sendEmail(
      foundUser.email,
      'ChiteS',
      foundUser.emailConfirmation.confirmationCode!,
    );
    return;
  }
}
