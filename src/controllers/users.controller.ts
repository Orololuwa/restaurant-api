import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from 'src/services/users/users.service';
import { Role } from 'src/lib/helpers';
import { auth } from 'src/core/decorators/auth.decorator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @auth(Role.Admin)
  async getAllUsers(@Res({ passthrough: false }) res: Response) {
    return res.status(HttpStatus.OK).json(await this.usersService.findAll());
  }
}
