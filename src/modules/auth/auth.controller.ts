import {
  Req,
  Get,
  Body,
  Post,
  UseGuards,
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const validated = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!validated) {
      return new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(validated);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
