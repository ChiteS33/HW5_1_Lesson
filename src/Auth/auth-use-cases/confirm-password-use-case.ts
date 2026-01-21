import { Inject } from '@nestjs/common';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../core/adapters/bcryptAdapter/bcrypt.service';

export class ConfirmPasswordRecoveryCommand {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
  ) {}
}

@CommandHandler(ConfirmPasswordRecoveryCommand)
export class ConfirmPasswordRecoveryUseCase implements ICommandHandler<ConfirmPasswordRecoveryCommand> {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(BcryptService) private bcryptService: BcryptService,
  ) {}

  async execute(command: ConfirmPasswordRecoveryCommand): Promise<void> {
    const foundUser = await this.usersRepository.findUserByRecoveryCode(
      command.recoveryCode,
    );
    if (!foundUser) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'recoveryCode',
        message: 'Invalid recoveryCode',
      });
    }
    foundUser.passwordHash = await this.bcryptService.hashMake(
      command.newPassword,
    );
    await this.usersRepository.save(foundUser);
    return;
  }
}
