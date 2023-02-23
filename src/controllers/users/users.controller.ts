import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { UsersService } from 'src/services/users/users.service';
import { UserDTO } from 'src/controllers/users/dtos/dto';
import { isAdmin } from 'src/core/decorators/admin.decorator';
import { Role } from 'src/lib/helpers';

@Controller('users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @isAdmin(Role.Admin)
  @Get('')
  getAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
