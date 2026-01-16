import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { UsersRepository } from '../../users/users.repository';
import { UserDocument } from '../../users/users.entity';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: {
    userId: string;
    iat: number;
    exp: number;
  }): Promise<UserDocument> {
    if (!payload) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        field: 'jwtToken',
        message: 'Invalid payload',
      });
    }
    const foundedUser = await this.usersRepository.findUserById(payload.userId);
    if (!foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'jwtToken',
        message: 'User not found',
      });
    }

    return foundedUser;
  }
}
