import { Inject } from '@nestjs/common';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ConfirmRegistrationCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase implements ICommandHandler<ConfirmRegistrationCommand> {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  async execute(command: ConfirmRegistrationCommand): Promise<void> {
    const foundUser = await this.usersRepository.findUserByConfirmationCode(
      command.code,
    );
    if (!foundUser) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'code',
        message: 'Invalid confirmation code',
      });
    }
    if (foundUser.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'code',
        message: 'User is confirmed',
      });
    }
    if (foundUser.emailConfirmation.confirmationCode !== command.code) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'confirmationCode',
        message: 'Confirmation Code does not match',
      });
    }
    if (
      !foundUser.emailConfirmation.expirationDate ||
      foundUser.emailConfirmation.expirationDate < new Date()
    ) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'confirmationCode',
        message: 'Confirmation expired',
      });
    }
    foundUser.changeConfirmationStatus(true);
    await this.usersRepository.save(foundUser);
    return;
  }
}
