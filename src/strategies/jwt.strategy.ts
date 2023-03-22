import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayload } from 'src/modules/authentication/auth.payload.interface';
import { Strategy, ExtractJwt, } from 'passport-local';
    
@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: 'JWT_SECRET_KEY',
        });
      }

      async validate(payload: AuthPayload) {
        return { email: payload.email };
      }
    }
