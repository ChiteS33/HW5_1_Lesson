import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { basicConstants } from './constants';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = (username: string, password: string): boolean => {
    if (
      basicConstants.userName === username &&
      basicConstants.password === password
    ) {
      return true;
    }
    throw new DomainException({
      code: DomainExceptionCode.Unauthorized,
      field: 'accessToken',
      message: 'Access Token is invalid',
    });
  };
}
