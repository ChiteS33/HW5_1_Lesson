import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { UserDocument } from '../../users/users.entity';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';

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
    const user = await this.authService.validateUser(loginOrEmail, password);
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
