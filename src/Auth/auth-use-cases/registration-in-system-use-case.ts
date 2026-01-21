import { Inject } from '@nestjs/common';
import { UsersRepository } from '../../users/repositories/users.repository';
import { UserInputDto, UserModel } from '../../users/users.entity';
import { UsersService } from '../../users/users.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../core/adapters/emailAdapter/email-adapter';
import { BcryptService } from '../../core/adapters/bcryptAdapter/bcrypt.service';

export class RegistrationInSystemCommand {
  constructor(public body: UserInputDto) {}
}

@CommandHandler(RegistrationInSystemCommand)
export class RegistrationInSystemUseCase implements ICommandHandler<RegistrationInSystemCommand> {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(EmailAdapter) private emailAdapter: EmailAdapter,
    @Inject(BcryptService) private bcryptService: BcryptService,
  ) {}
  async execute(command: RegistrationInSystemCommand): Promise<void> {
    const passwordHash = await this.bcryptService.hashMake(
      command.body.password,
    );
    await this.usersService.findUserByLogin(command.body.login);
    await this.usersService.findUserByEmail(command.body.email);
    const createdUser = UserModel.createUser(command.body, passwordHash);
    await this.usersRepository.save(createdUser);
    await this.emailAdapter.sendEmail(
      command.body.email,
      'Chites',
      createdUser.emailConfirmation.confirmationCode!,
    );
    return;
  }
}
