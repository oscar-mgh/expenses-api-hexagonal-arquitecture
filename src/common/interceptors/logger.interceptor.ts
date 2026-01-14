import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const { method, url } = ctx.getRequest();
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = ctx.getResponse();
          this.logger.log(
            `${method} ${url} ${statusCode} - ${Date.now() - now}ms`,
          );
        },
        error: (err) => {
          this.logger.error(
            `${method} ${url} ${err.status || 500} - ${Date.now() - now}ms`,
          );
        },
      }),
    );
  }
}
