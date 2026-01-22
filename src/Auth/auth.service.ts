import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/users.repository';
import { UserDocument } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import { EmailAdapter } from '../core/adapters/emailAdapter/email-adapter';
import { BcryptService } from '../core/adapters/bcryptAdapter/bcrypt.service';
import { BodyInputDto } from './validation/auth.validation';

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
}
