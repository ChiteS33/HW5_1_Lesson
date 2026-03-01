import { Inject } from '@nestjs/common';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../core/adapters/emailAdapter/email-adapter';
import { add } from 'date-fns';
import { UserInDB } from '../../users/types/users.types';

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
    const foundUser: UserInDB | null =
      await this.usersRepository.findUserByLoginOrEmail(command.email);
    if (!foundUser) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'email',
        message: 'Invalid email',
      });
    }
    if (foundUser.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'email',
        message: 'Email is confirmed',
      });
    }

    const newConfirmationCode = crypto.randomUUID();
    const newExpDate = add(new Date(), { hours: 1 });
    await this.usersRepository.refreshConfirmationCode(
      newConfirmationCode,
      newExpDate,
      foundUser.id,
    );

    this.emailAdapter.sendEmail(foundUser.email, 'ChiteS', newConfirmationCode);
    return;
  }
}
