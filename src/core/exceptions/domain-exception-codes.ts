//если специфических кодов будет много лучше разнести их в соответствующие модули
export enum DomainExceptionCode {
  //common
  NotFound = 'Not Found',
  BadRequest = 'BadRequest',
  InternalServerError = 'InternalServerError',
  Forbidden = 'Forbidden',
  ValidationError = 'ValidationError',
  //auth
  Unauthorized = 'Unauthorized',
  EmailNotConfirmed = 'EmailNotConfirmed',
  ConfirmationCodeExpired = 'ConfirmationCodeExpired',
  PasswordRecoveryCodeExpired = 'PasswordRecoveryCodeExpired',
  //...
}
