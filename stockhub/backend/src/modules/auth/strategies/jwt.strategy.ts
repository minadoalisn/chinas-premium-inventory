import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy('jwt') {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'stockhub-jwt-secret-key-2026'),
    });
  }

  async validate(payload: any) {
    if (!payload.userId && !payload.sub) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId || payload.sub,
      phone: payload.phone,
      role: payload.role || 'buyer',
      merchantId: payload.merchantId,
    };
  }
}
