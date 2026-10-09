import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        if (result === undefined || result === null) {
          return { data: null };
        }

        // If response is already structured with data/meta (paginated list)
        if (typeof result === 'object' && 'data' in result && 'meta' in result) {
          return result;
        }

        return result;
      }),
    );
  }
}
