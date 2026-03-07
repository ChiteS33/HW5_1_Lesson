import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';

export class inputValidationLoginOrEmailAndPass {
  @IsStringWithTrim(1, 200)
  loginOrEmail: string;
  @IsStringWithTrim(1, 200)
  password: string;
}
