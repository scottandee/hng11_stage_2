import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/api/users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  usersService = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  jwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto = {
        email: 'sasa@gmail.com',
        password: 'mana',
      } as LoginDto;
      const user = {
        userId: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');
      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await service.login(loginDto);

      expect(result).toEqual({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: 'token',
          user,
        },
      });
    });

    it('should throw an error if email does not exist', async () => {
      const loginDto = {
        email: 'sasa@gmail.com',
        password: 'mana',
      } as LoginDto;
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);
      (await expect(service.login(loginDto))).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password: 'password',
      } as CreateUserDto;
      const user = { userId: 1, ...createUserDto };
      (usersService.create as jest.Mock).mockResolvedValue(user);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken: 'token',
          user,
        },
      });
    });
  });
});
