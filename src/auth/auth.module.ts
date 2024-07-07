import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../api/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { OrganisationsService } from '../api/organisations/organisations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../api/users/entities/user.entity';
import { Organisation } from '../api/organisations/entities/organisation.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Organisation]),
  ],
  providers: [AuthService, UsersService, OrganisationsService],
  controllers: [AuthController]
})
export class AuthModule {}
