import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO, SignInDTO, UserDTO } from './dtos/dto';
import { AuthService } from 'src/services/auth/auth.service';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { LocalAuthGuard } from 'src/core/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('/user')
  getProfile(@CurrentUser() user: any) {
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

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return this.authService.signInJWT(req.user);
  }

  @Post('/signup/jwt')
  async signUpJWT(@Body() body: CreateUserDTO) {
    return this.authService.signUpJWT(body);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserDTO)
  @Get('/profile')
  getProfileJWT(@Request() req: any) {
    return req.user;
  }
}
