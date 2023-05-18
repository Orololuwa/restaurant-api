import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/lib/helpers';
import { isEmpty } from 'src/lib/utils';
import { MerchantsService } from 'src/services/merchants/merchants.service';

@Injectable()
export class MerchantAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private merchService: MerchantsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const role = this.reflector.get<Role>('merchant', context.getHandler());
      if (!role) {
        return true;
      }

      if (role !== Role.Merchant) {
        return true;
      }

      const request: Request = context.switchToHttp().getRequest();
      let token: string = request.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }
      token = token.replace('Bearer ', '');

      const decoded = await this.jwtService.verifyAsync(token);

      if (!decoded) {
        throw new UnauthorizedException('Unauthorized');
      }

      const merchant = await this.merchService.findOneWith({
        email: decoded.email,
        id: decoded.id,
      });
      if (isEmpty(merchant)) {
        throw new ForbiddenException('Merchant does not exist');
      }

      //   if (role === Role.Admin && user.role !== Role.Admin) {
      //     throw new ForbiddenException(
      //       'User unauthorized to perform this action',
      //     );
      //   }

      request.merchant = merchant.data;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Unauthorized');
    }
  }
}
