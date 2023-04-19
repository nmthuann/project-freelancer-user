import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayload } from 'src/modules/authentication/auth-dto/auth.payload.interface';
import { Strategy, ExtractJwt  } from 'passport-jwt';
import { Payload } from 'src/common/bases/types/payload.type';


@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: 'JWT_SECRET_KEY',
        });
      }

      validate(payload: Payload) {
        console.log('validate - JsonWebTokenStrategy: ', payload);
        return payload ;
      } 
    }
// { email: payload.email, 
//           role: payload.role }