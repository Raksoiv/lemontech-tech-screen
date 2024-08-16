import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(payload: CreateUserDto) {
    const {email, password} = payload;

    if (await this.userService.findEmail(email)) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = bcrypt.hashSync(payload.password, 10);
    const user = await this.userService.create({
      ...payload,
      password: hashedPassword,
    });
    return user;
  }
}
