import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EXPIRES_IN, JWT_SECRET_KEY } from '@/modules/auth/auth.constants';
import { DecodedPayload, TokenType } from '@/modules/auth/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string, salt: string) {
    return pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  }

  async register({ email, password }: RegisterUserDto) {
    const existedUser = await this.prisma.user.findUnique({ where: { email } });

    if (existedUser) {
      throw new BadRequestException('Could not use this email');
    }

    const salt = randomBytes(32).toString('hex');

    await this.prisma.user.create({
      data: {
        email,
        hashedPassword: this.hashPassword(password, salt),
        salt,
      },
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('No such user or password incorrect');
    }

    const hashedPassword = this.hashPassword(password, user.salt);

    if (user.hashedPassword !== hashedPassword) {
      throw new BadRequestException('No such user or password incorrect');
    }

    return this.generateTokensPair({
      sub: user.id,
      permissions: user.permissions,
    });
  }

  refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException('No token in cookie');
    }

    try {
      const decoded: DecodedPayload = this.jwtService.verify(token, {
        secret: this.configService.get<string>(JWT_SECRET_KEY),
      });
      return this.generateTokensPair({ sub: decoded.sub });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  private generateTokensPair(payload: Omit<DecodedPayload, 'type'>) {
    const accessToken = this.jwtService.sign(
      { ...payload, type: TokenType.ACCESS },
      {
        secret: this.configService.get<string>(JWT_SECRET_KEY),
        expiresIn: EXPIRES_IN.ACCESS,
      },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload, type: TokenType.REFRESH },
      {
        secret: this.configService.get<string>(JWT_SECRET_KEY),
        expiresIn: EXPIRES_IN.REFRESH,
      },
    );

    return { accessToken, refreshToken };
  }
}
