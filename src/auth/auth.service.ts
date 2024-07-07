import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../api/users/dto/create-user.dto';
import { UsersService } from '../api/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      const jwtPayload = { sub: user.userId };
      return {
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken: await this.jwtService.signAsync(jwtPayload),
          user,
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        status: 'Bad request',
        message: 'Registration unsuccessful',
        statusCode: 400,
      });
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findOneByEmail(loginDto.email);
      if (!user) throw new NotFoundException();

      const isMatch = bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) throw new UnauthorizedException();
      const jwtPayload = { sub: user.userId };
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: await this.jwtService.signAsync(jwtPayload),
          user,
        },
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }
  }
}
