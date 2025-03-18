import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [AuthService, PrismaService, ConfigService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
