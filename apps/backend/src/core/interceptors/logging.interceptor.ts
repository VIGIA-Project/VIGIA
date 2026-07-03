import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VigiaLogger } from '@shared/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: VigiaLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'] ?? '-';
    const start = Date.now();

    this.logger.log(
      `→ ${method} ${url} [${ip}] [${userAgent}]`,
      'HTTP',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const elapsed = Date.now() - start;
          this.logger.log(
            `← ${method} ${url} ${response.statusCode} ${elapsed}ms`,
            'HTTP',
          );
        },
        error: (error: Error) => {
          const elapsed = Date.now() - start;
          this.logger.error(
            `← ${method} ${url} ERROR ${elapsed}ms`,
            error.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
