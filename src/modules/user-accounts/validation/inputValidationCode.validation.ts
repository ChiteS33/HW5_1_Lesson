import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';

export class InputValidationCode {
  @IsStringWithTrim(1, 100)
  code: string;
}
