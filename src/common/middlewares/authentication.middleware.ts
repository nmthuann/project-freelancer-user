import {HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {

    // get header from request
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'undefined') {
      throw new HttpException(
        'Middleware - Unauthorized: 401 - header empty!!!',  
        HttpStatus.UNAUTHORIZED
      );
    } 
    else{
      const token: string = req.get('authorization').replace('Bearer', '').trim();
      try {
        await this.jwtService.verifyAsync(
          token,
          {
            secret: 'JWT_SECRET_KEY',
          }
        ); 
        req['user'] = (this.jwtService.decode(token))['payload'];
        // req['token']
        next();
      } catch (error) {
         res.status(HttpStatus.FORBIDDEN)
          .json({ message: 'Invalid or expired token' });
      }
    }
  }
}