import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO, UserDTO } from '../users/dtos/dto';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { LoginDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDTO) {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  async login(@Body() body: LoginDTO) {
    return this.authService.signIn(body);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserDTO)
  @Get('/profile')
  getProfileJWT(@Request() req: any) {
    return req.user;
  }
}
