import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { CreateUserDTO } from '../core/dtos/users/dto';
import { AuthService } from 'src/services/auth/auth.service';
import { LoginDTO } from '../core/dtos/auth/login.dto';
import { Request as ReqExp, Response } from 'express';
import { auth } from 'src/core/decorators';
import { Role } from 'src/lib/helpers';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDTO, @Res() res: Response) {
    const response = await this.authService.signUp(body);
    return res.status(response.status).json(response);
  }

  @Post('/signin')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const response = await this.authService.signIn(body);
    return res.status(response.status).json(response);
  }

  @auth(Role.User)
  @Get('/profile')
  getProfileJWT(@Request() req: ReqExp, @Res() res: Response) {
    return res.status(200).json(req.user);
  }
}
