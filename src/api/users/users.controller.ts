import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @UseGuards(AuthGuard)
  findOne(@Param('userId', ParseUUIDPipe) userId: string, @Request() request) {
    return this.usersService.findOne(userId, request.user.sub);
  }
}
