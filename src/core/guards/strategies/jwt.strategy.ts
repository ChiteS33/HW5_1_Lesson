import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { settings } from './constants';
import { UsersRepository } from '../../../users/repositories/users.repository';
import { UserInDB } from '../../../users/types/users.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: settings.JWT_SECRET,
    });
  }

  async validate(payload: {
    userId: string;
    iat: number;
    exp: number;
  }): Promise<UserInDB | null> {
    if (!payload) {
      return null;
    }
    const foundedUser: UserInDB | null =
      await this.usersRepository.findUserById(payload.userId);
    if (!foundedUser) {
      return null;
    }

    return foundedUser;
  }
}
