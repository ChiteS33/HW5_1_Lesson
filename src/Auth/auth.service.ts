import { Inject, Injectable } from '@nestjs/common';

import { UsersRepository } from '../users/repositories/users.repository';
import { UserDocument } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { BodyInputDto } from './auth.trash';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import { EmailAdapter } from '../core/adapters/emailAdapter/email-adapter';
import { BcryptService } from '../core/adapters/bcryptAdapter/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(EmailAdapter) private readonly emailAdapter: EmailAdapter,
    @Inject(BcryptService) private readonly bcryptService: BcryptService,
  ) {}

  async checkingUser(body: BodyInputDto): Promise<UserDocument> {
    const foundedUser = await this.usersService.findUserByLoginOrEmail(
      body.loginOrEmail,
    );
    if (!foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'loginOrEmail',
        message: 'Invalid login or password',
      });
    }
    const isValid = await this.bcryptService.compare(
      body.password,
      foundedUser.passwordHash,
    );
    if (!isValid) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'Password',
        message: 'Invalid password',
      });
    }
    return foundedUser;
  }

  // async login(user: UserDocument, body: BodyInputDto): Promise<string> {
  //   await this.checkingUser(body);
  //   const payload = { userId: user._id.toString() };
  //   return this.jwtService.sign(payload);
  // }

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument | null> {
    const foundedUser: UserDocument | null =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'loginOrEmail',
        message: 'Invalid login or email',
      });
    }
    const checkHash = await this.bcryptService.compare(
      password,
      foundedUser.passwordHash,
    );
    if (!checkHash) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'password',
        message: 'Invalid password',
      });
    }
    return foundedUser;
  }

  // async recoveryPassword(email: string): Promise<void> {
  //   const foundUser = await this.usersRepository.findUserByLoginOrEmail(email);
  //   if (!foundUser) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.Unauthorized,
  //       field: 'email',
  //       message: 'Invalid email',
  //     });
  //   }
  //   foundUser.recoveryCode();
  //   await this.usersRepository.save(foundUser);
  //   await this.emailAdapter.resendEmail(
  //     email,
  //     foundUser.recoveryData.recoveryCode!,
  //   );
  //   return;
  // }

  // async confirmPassword(
  //   newPassword: string,
  //   recoveryCode: string,
  // ): Promise<void> {
  //   const foundUser =
  //     await this.usersRepository.findUserByRecoveryCode(recoveryCode);
  //   if (!foundUser) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.Unauthorized,
  //       field: 'recoveryCode',
  //       message: 'Invalid recoveryCode',
  //     });
  //   }
  //   foundUser.passwordHash = await this.bcryptService.hashMake(newPassword);
  //   await this.usersRepository.save(foundUser);
  //   return;
  // }

  // async confirmRegistration(code: string): Promise<void> {
  //   const foundUser =
  //     await this.usersRepository.findUserByConfirmationCode(code);
  //   if (!foundUser) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.BadRequest,
  //       field: 'code',
  //       message: 'Invalid confirmation code',
  //     });
  //   }
  //   if (foundUser.emailConfirmation.isConfirmed) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.BadRequest,
  //       field: 'code',
  //       message: 'User is confirmed',
  //     });
  //   }
  //   if (foundUser.emailConfirmation.confirmationCode !== code) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.Unauthorized,
  //       field: 'confirmationCode',
  //       message: 'Confirmation Code does not match',
  //     });
  //   }
  //   if (
  //     !foundUser.emailConfirmation.expirationDate ||
  //     foundUser.emailConfirmation.expirationDate < new Date()
  //   ) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.BadRequest,
  //       field: 'confirmationCode',
  //       message: 'Confirmation expired',
  //     });
  //   }
  //   foundUser.changeConfirmationStatus(true);
  //   await this.usersRepository.save(foundUser);
  //   return;
  // }

  // async registrationInSystem(body: UserInputDto): Promise<void> {
  //   const passwordHash = await this.bcryptService.hashMake(body.password);
  //   await this.findUserByLoginUseCase.execute(body.login);
  //   await this.findUserByEmailUseCase.execute(body.email);
  //   const createdUser = UserModel.createUser(body, passwordHash);
  //   await this.usersRepository.save(createdUser);
  //   await this.emailAdapter.sendEmail(
  //     body.email,
  //     'Chites',
  //     createdUser.emailConfirmation.confirmationCode!,
  //   );
  //   return;
  // }

  // async resendConfirmationCode(email: string): Promise<void> {
  //   const foundUser = await this.usersRepository.findUserByLoginOrEmail(email);
  //   if (!foundUser) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.BadRequest,
  //       field: 'email',
  //       message: 'Invalid email',
  //     });
  //   }
  //   if (foundUser.emailConfirmation.isConfirmed) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.BadRequest,
  //       field: 'email',
  //       message: 'Email is confirmed',
  //     });
  //   }
  //   foundUser.refreshConfirmationCode();
  //   await this.usersRepository.save(foundUser);
  //   await this.emailAdapter.sendEmail(
  //     foundUser.email,
  //     'ChiteS',
  //     foundUser.emailConfirmation.confirmationCode!,
  //   );
  //   return;
  // }
}
