import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { UsersService } from 'src/services/users/users.service';
import { UserDTO } from 'src/controllers/users/dtos/dto';
import { JwtAdminGuard } from 'src/core/guards/jwt-admin.guard';

@UseGuards(JwtAdminGuard)
@Controller('users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  getAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
