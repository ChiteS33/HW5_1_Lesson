import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import { BcryptService } from '../core/adapters/bcryptAdapter/bcrypt.service';
import { BodyInputDto } from './validation/auth.validation';
import { UserInDB } from '../users/types/users.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(BcryptService) private readonly bcryptService: BcryptService,
  ) {}

  async checkingUser(body: BodyInputDto): Promise<UserInDB> {
    const foundUser: UserInDB = await this.usersService.findUserByLoginOrEmail(
      body.loginOrEmail,
    );
    const isValid = await this.bcryptService.compare(
      body.password,
      foundUser.passwordHash,
    );
    if (!isValid) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'Password',
        message: 'Invalid password',
      });
    }
    return foundUser;
  }
}
