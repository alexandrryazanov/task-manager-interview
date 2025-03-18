import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { RegisterUserDto } from '@/modules/auth/dto/register.dto';
import AuthGuard from '@/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() { email, password }: RegisterUserDto) {
    return this.authService.register({
      email,
      password,
    });
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login({
      email,
      password,
    });
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const token = request.cookies['refreshToken'];

    const { accessToken, refreshToken } = this.authService.refresh(token);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken');
  }
}
