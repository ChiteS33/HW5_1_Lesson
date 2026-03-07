import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';

export class inputValidationPasswordAndRecoveryCode {
  @IsStringWithTrim(6, 20)
  newPassword: string;
  @IsStringWithTrim(1, 100)
  recoveryCode: string;
}
