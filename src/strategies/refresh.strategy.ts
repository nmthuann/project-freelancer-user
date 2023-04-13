import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayload } from 'src/modules/authentication/auth-dto/auth.payload.interface';
import { Strategy, ExtractJwt  } from 'passport-jwt';
import { Request } from 'express';
import { Payload } from 'src/common/types/payload.type';


@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {// problem is here
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'REFRESH_JWT_SECRET_KEY',
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: Payload) {
        // chưa hiểu lắm
        //const refreshToken = req.get('authorization').replace('Bearer','').trim();
        const refreshToken = req
            ?.get('authorization') // check xem a hay A
            ?.replace('Bearer', '')
            .trim();
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        console.log("validate - RefreshJWTStrategy - payload: ", payload)
        console.log("validate - RefreshJWTStrategy - refreshToken: ", refreshToken);
        return {
            ...payload,
            refreshToken,
        }
        // return payload;
    }
}
