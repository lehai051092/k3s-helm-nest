import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE } from '../decorator/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Response<T> {
  statusCode: number;
  message?: string;
  data: any;
}

@Injectable()
export class Transform<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || '',
        data: data,
      })),
    );
  }
}
