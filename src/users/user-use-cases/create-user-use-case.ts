import { Inject } from '@nestjs/common';
import { UserInputDto, UserModel, UserModelI } from '../users.entity';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../repositories/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../core/adapters/bcryptAdapter/bcrypt.service';

export class CreateUserCommand {
  constructor(public inputDto: UserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(UserModel.name) public userModel: UserModelI,
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(BcryptService) private bcryptService: BcryptService,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const foundedUserByLogin = await this.usersRepository.findUserByLogin(
      command.inputDto.login,
    );

    if (foundedUserByLogin)
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'login',
        message: 'Login now is using',
      });
    const foundedUserByEmail = await this.usersRepository.findUserByEmail(
      command.inputDto.email,
    );

    if (foundedUserByEmail) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'email',
        message: 'Email already in use',
      });
    }
    const hash = await this.bcryptService.hashMake(command.inputDto.password);

    return await this.usersRepository.saveUserByAdmin(
      command.inputDto.login,
      command.inputDto.email,
      hash,
    );
  }
}
