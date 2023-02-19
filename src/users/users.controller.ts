import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.inteceptor';
import { CreateUserDTO, SignInDTO } from './dtos/dto';
import { UsersService } from '../services/users.service';
import { UserDTO } from 'src/users/dtos/dto';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../core/decorators/current-user.decorators';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/user')
  @UseGuards(AuthGuard)
  getUser(@CurrentUser() user: any) {
    return user;
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signUp(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: SignInDTO, @Session() session: any) {
    const user = await this.authService.signIn(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/users')
  getAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/users/:id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
