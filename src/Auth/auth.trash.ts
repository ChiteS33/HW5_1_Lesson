import { IsStringWithTrim } from '../users/users.trash';
import { Matches } from 'class-validator';

export class BodyInputDto {
  @IsStringWithTrim(1, 200)
  loginOrEmail: string;
  @IsStringWithTrim(1, 200)
  password: string;
}

export type OutPutInfoAboutMe = {
  email: string;
  login: string;
  userId: string;
};

export class InputValidationEmail {
  @IsStringWithTrim(1, 100)
  @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  email: string;
}
export class InputValidationCode {
  @IsStringWithTrim(1, 100)
  code: string;
}
export class ConfirmPasswordRecovery {
  @IsStringWithTrim(6, 20)
  newPassword: string;
  @IsStringWithTrim(1, 100)
  recoveryCode: string;
}
