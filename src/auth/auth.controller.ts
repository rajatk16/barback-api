import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';

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
