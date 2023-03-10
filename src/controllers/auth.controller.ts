import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { CreateUserDTO, UserDTO } from '../core/dtos/users/dto';
import { AuthService } from 'src/services/auth/auth.service';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { LoginDTO } from '../core/dtos/auth/login.dto';
import { Response } from 'express';
import { auth } from 'src/core/decorators/auth.decorator';
import { Role } from 'src/lib/helpers';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDTO, @Res() res: Response) {
    try {
      const response = await this.authService.signUp(body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Post('/signin')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    try {
      const response = await this.authService.signIn(body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Serialize(UserDTO)
  @auth(Role.User)
  @Get('/profile')
  getProfileJWT(@Request() req: any) {
    return req.user;
  }
}
