import { Inject } from '@nestjs/common';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../core/adapters/bcryptAdapter/bcrypt.service';
import { UserInDB } from '../../users/types/users.types';

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
    const foundUser: UserInDB | null =
      await this.usersRepository.findUserByRecoveryCode(command.recoveryCode);
    if (!foundUser) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'recoveryCode',
        message: 'Invalid recoveryCode',
      });
    }
    const newHash = await this.bcryptService.hashMake(command.newPassword);
    await this.usersRepository.updatePassword(foundUser.id, newHash);
    return;
  }
}
