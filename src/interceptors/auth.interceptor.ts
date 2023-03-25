// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable, switchMap } from 'rxjs';
// import { AuthGuard, IAuthGuard } from '@nestjs/passport';
// import {  } from '@nestjs/passport';
// @Injectable()
// export class AuthInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const authGuard = AuthGuard('jwt');
//     return authGuard.canActivate(context).pipe(
//       switchMap(() => next.handle()),
//     );
//   }
// }