import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayload } from 'src/modules/authentication/auth.payload.interface';
import { Strategy, ExtractJwt  } from 'passport-jwt';
import { Request } from 'express';


@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'REFRESH_JWT_SECRET_KEY',
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        // chưa hiểu lắm
        const refreshToken = req.get('authorization').replace('Bearer','').trim();
        return {
            ...payload,
            refreshToken,
        }
        // return payload;
    }
}
