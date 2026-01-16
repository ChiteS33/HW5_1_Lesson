import { DomainExceptionCode } from './domain-exception-codes';

export class Extension {
  constructor(
    public message: string,
    public key: string,
  ) {}
}

export class DomainException extends Error {
  code: DomainExceptionCode;
  field: string;
  message: string;

  constructor(errorInfo: {
    code: DomainExceptionCode;
    field: string;
    message: string;
  }) {
    super(errorInfo.message);
    this.message = errorInfo.message;
    this.code = errorInfo.code;
    this.field = errorInfo.field;
  }
}
