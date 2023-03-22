import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { UsersService } from 'src/services/users/users.service';
import { UserDTO } from 'src/core/dtos/users/dto';
import { Role } from 'src/lib/helpers';
import { auth } from 'src/core/decorators/auth.decorator';
import { Response } from 'express';

@Controller('users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @auth(Role.Admin)
  async getAllUsers(@Res() res: Response) {
    try {
      const response = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Delete('/:id')
  @auth(Role.User)
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
