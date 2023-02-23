import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/lib/helpers';
import { isEmpty } from 'src/lib/utils';
import { UsersService } from 'src/services/users/users.service';


// 
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<Role>('role', context.getHandler());
    if (!role) {
      return true;
    }

    if (role !== Role.Admin) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    let token: string = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    token = token.replace('Bearer ', '');

    if (!this.jwtService.decode(token)) {
      throw new UnauthorizedException('Invalid Token');
    }

    const decoded = await this.jwtService.verifyAsync(token);

    if (!decoded) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.usersService.findOne(decoded.sub);
    if (isEmpty(user)) {
      throw new ForbiddenException('User does not exist');
    }

    if (user.role !== role) {
      throw new ForbiddenException('User unauthorized to perform this action');
    }

    request.user = user;
    return true;
  }
}
