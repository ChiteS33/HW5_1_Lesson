import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Extension } from '../core/exceptions/domain-exceptions';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);
        throw new BadRequestException(formattedErrors);
      },
    }),
  );
}

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage?: any,
): Extension[] => {
  const errorsForResponse = errorMessage || [];
  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      errorFormatter(error.children, errorsForResponse);
    } else if (error.constraints) {
      const constrainKeys = Object.keys(error.constraints);
      for (const key of constrainKeys) {
        errorsForResponse.push({
          message: error.constraints[key]
            ? `${error.constraints[key]}; Received value: ${error?.value}`
            : '',
          field: error.property,
        });
      }
    }
  }

  return errorsForResponse;
};
