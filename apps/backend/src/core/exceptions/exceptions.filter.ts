import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from './domain-exception';
import { VigiaLogger } from '@shared/logger/logger.service';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  code?: string;
  errors?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: VigiaLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    this.logException(exception, errorResponse, request);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    // Excepciones de dominio propias
    if (exception instanceof DomainException) {
      return {
        statusCode: exception.statusCode,
        timestamp,
        path,
        method,
        message: exception.message,
        code: exception.code,
      };
    }

    // Excepciones HTTP de NestJS
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return {
        statusCode: status,
        timestamp,
        path,
        method,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as Record<string, string>).message ??
              exception.message,
        errors:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as Record<string, unknown>).message
            : undefined,
      };
    }

    // Errores no controlados
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path,
      method,
      message: 'Error interno del servidor',
      code: 'INTERNAL_SERVER_ERROR',
    };
  }

  private logException(
    exception: unknown,
    errorResponse: ErrorResponse,
    request: Request,
  ): void {
    const logContext = {
      path: errorResponse.path,
      method: errorResponse.method,
      statusCode: errorResponse.statusCode,
      userAgent: request.headers['user-agent'],
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `[${errorResponse.statusCode}] ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : String(exception),
        'ExceptionsFilter',
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(
        `[${errorResponse.statusCode}] ${errorResponse.message}`,
        'ExceptionsFilter',
      );
    }
  }
}
