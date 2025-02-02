import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body(ValidationPipe) signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body(ValidationPipe) signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }
}
