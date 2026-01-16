// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
//
// export class ErrorResponseBody {
//   errorsMessages: [
//     {
//       field: string;
//       message: string;
//     },
//   ];
// }
//
// export class DomainException extends Error {
//   message: string;
//   code: DomainExceptionCode;
//   extensions: Extension[];
//   field: string;
//
//   constructor(errorInfo: {
//     code: DomainExceptionCode;
//     message: any;
//     extensions?: Extension[];
//     field: any;
//   }) {
//     super(errorInfo.message);
//     this.message = errorInfo.message;
//     this.code = errorInfo.code;
//     this.extensions = errorInfo.extensions || [];
//     this.field = errorInfo.field;
//   }
// }
//
// @Catch(DomainException)
// export class DomainHttpExceptionsFilter implements ExceptionFilter {
//   catch(exception: DomainException, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = this.mapToHttpStatus(exception.code);
//     const responseBody = this.buildResponseBody(exception, request.url);
//
//     response.status(status).json(responseBody);
//   }
//
//   private mapToHttpStatus(code: DomainExceptionCode): number {
//     switch (code) {
//       case DomainExceptionCode.BAD_REQUEST:
//       case DomainExceptionCode.VALIDATION_ERROR:
//       case DomainExceptionCode.CONFIRMATION_CODE_EXPIRED:
//       case DomainExceptionCode.EMAIL_NOT_CONFIRMED:
//       case DomainExceptionCode.PASSWORD_RECOVERY_CODE_EXPIRED:
//         return HttpStatus.BAD_REQUEST;
//       case DomainExceptionCode.FORBIDDEN:
//         return HttpStatus.FORBIDDEN;
//       case DomainExceptionCode.NOT_FOUND:
//         return HttpStatus.NOT_FOUND;
//       case DomainExceptionCode.UNAUTHORIZED:
//         return HttpStatus.UNAUTHORIZED;
//       case DomainExceptionCode.INTERNAL_ERROR:
//         return HttpStatus.INTERNAL_SERVER_ERROR;
//       default:
//         return HttpStatus.I_AM_A_TEAPOT;
//     }
//   }
//
//   private buildResponseBody(
//     exception: DomainException,
//     requestUrl: string,
//   ): ErrorResponseBody {
//     return {
//       errorsMessages: [
//         {
//           message: exception.message,
//           field: exception.field,
//         },
//       ],
//     };
//   }
// }
//
// @Catch()
// export class AllHttpExceptionsFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const message = exception.message || 'Unknown exception occurred.';
//     const status = exception.status;
//
//     if (status === '400') {
//       const errorResponse = {
//         errors: [],
//       };
//       const responseBody: any = exception.getResponse();
//
//       (responseBody.message as string[]).forEach(
//         (m: any) => console.log(errorResponse),
//         // @ts-ignore
//         errorResponse.errors.push(m),
//
//         response.status(status).json(errorResponse),
//       );
//     } else {
//       response.status(status).json();
//     }
//   }
// }
