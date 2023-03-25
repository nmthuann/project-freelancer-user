// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from './auth.service';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(
//     private readonly authService: AuthService,
//   ) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     // Use the JwtStrategy to authenticate the user
//     await this.passportService.authenticate('jwt', { session: false }, (err, user) => {
//       if (err || !user) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       req.user = user;
//       next();
//     })(req, res, next);
//   }
// }
