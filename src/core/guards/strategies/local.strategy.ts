import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { AuthService } from '../../../Auth/auth.service';
import { UserDocument } from '../../../users/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.authService.checkingUser({
      loginOrEmail,
      password,
    });
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'loginOrEmail or password',
        message: 'Invalid loginOrEmail or password',
      });
    }
    return user;
  }
}
