import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
