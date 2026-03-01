import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorsMessages: any = [];
      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((m) => errorsMessages.push(m));
        return response.status(status).json({ errorsMessages: errorsMessages });
      }
    }

    if (status === 401) {
      return response.status(status).json({
        errorsMessages: [
          {
            field: 'Token',
            message: 'Unauthorize',
          },
        ],
      });
    }
    return response
      .status(status)
      .json({ statusCode: status, meta: 'AllExceptionFilter' }); //status.code
  }
}
