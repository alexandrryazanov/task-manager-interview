import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodedPayload, TokenType } from '@/modules/auth/auth.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET_KEY } from '@/modules/auth/auth.constants';

export default function AuthGuard(requiredPermission?: number) {
  @Injectable()
  class AuthMixin implements CanActivate {
    constructor(
      public jwtService: JwtService,
      public configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const header = request.headers['authorization']; // Bearer ,dkdfockkeoc,e
      const token = header?.split(' ')?.[1];

      if (!token) throw new UnauthorizedException('No token in headers');

      let decoded: DecodedPayload;
      try {
        decoded = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get(JWT_SECRET_KEY),
        });

        request['user'] = { id: decoded.sub, permissions: decoded.permissions };
      } catch {
        throw new UnauthorizedException('Error when token decoding');
      }

      if (decoded.type !== TokenType.ACCESS) {
        throw new UnauthorizedException('Incorrect token type');
      }

      if (typeof requiredPermission !== 'undefined') {
        if (!request.user.permissions) return false;
        return (
          (request.user.permissions & requiredPermission) === requiredPermission
        );
      }

      return true;
    }
  }
  return mixin(AuthMixin);
}
