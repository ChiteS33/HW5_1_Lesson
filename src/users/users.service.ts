import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './repositories/users.repository';
import { UserDocument, UserModel, UserModelI } from './users.entity';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import { BcryptService } from '../core/adapters/bcryptAdapter/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: UserModelI,
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(BcryptService) private bcryptService: BcryptService,
  ) {}

  async findUserById(userId: string): Promise<UserDocument> {
    const foundedUser = await this.usersRepository.findUserById(userId);
    if (!foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'userId',
        message: 'User not found',
      });
    }
    return foundedUser;
  }

  // async createUser(inputDto: UserInputDto): Promise<string> {
  //   const foundedUserByLogin = await this.usersRepository.findUserByLogin(
  //     inputDto.login,
  //   );
  //   if (foundedUserByLogin)
  //     throw new DomainException({
  //       code: DomainExceptionCode.Unauthorized,
  //       field: 'login',
  //       message: 'Login now is using',
  //     });
  //   const foundedUserByEmail = await this.usersRepository.findUserByEmail(
  //     inputDto.email,
  //   );
  //   if (foundedUserByEmail) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.BadRequest,
  //       field: 'email',
  //       message: 'Email already in use',
  //     });
  //   }
  //   const hash = await this.bcryptService.hashMake(inputDto.password);
  //
  //   const createDto = {
  //     login: inputDto.login,
  //     email: inputDto.email,
  //     passwordHash: hash,
  //   };
  //   const createdUser = this.userModel.createUserByAdmin(createDto);
  //   return await this.usersRepository.save(createdUser);
  // }

  // async deleteUser(userId: string): Promise<void> {
  //   await this.findUserById(userId);
  //   await this.usersRepository.deleteUserById(userId);
  //   return;
  // }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    const foundedUser =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'loginOrEmail',
        message: 'User not found',
      });
    }
    return foundedUser;
  }

  async findUserByLogin(login: string): Promise<void> {
    const foundedUser =
      await this.usersRepository.findUserByLoginOrEmail(login);
    if (foundedUser)
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User already exists',
        field: 'login',
      });
    return;
  }

  async findUserByEmail(email: string): Promise<void> {
    const foundedUser =
      await this.usersRepository.findUserByLoginOrEmail(email);
    if (foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        field: 'email',
        message: 'User already exists',
      });
    }
  }
}
