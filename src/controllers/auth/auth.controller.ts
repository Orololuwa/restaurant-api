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
import { LocalAuthGuard } from 'src/core/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDTO) {
    return this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserDTO)
  @Get('/profile')
  getProfileJWT(@Request() req: any) {
    return req.user;
  }
}
