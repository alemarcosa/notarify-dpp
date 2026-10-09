import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, params } = request;

    // Only log write operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (response) => {
          try {
            // Very basic entity extraction from URL for demonstration
            const segments = url.split('/').filter(Boolean);
            const entityType = segments[1] || 'unknown'; // api/<entity>
            const entityId = params.id || response?.data?.id || response?.id || 'unknown';
            
            await this.prisma.auditLog.create({
              data: {
                userId: user?.id || null,
                action: method,
                entityType,
                entityId,
                newValues: body,
              },
            });
          } catch (error) {
            console.error('Failed to create audit log', error);
          }
        }),
      );
    }

    return next.handle();
  }
}
