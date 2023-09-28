import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Restaurant } from 'src/frameworks/typeorm/entities/restaurants.entity';
import { Role } from 'src/lib/helpers';
import { isEmpty } from 'src/lib/utils';
import { DataSource } from 'typeorm';

@Injectable()
export class IsRestaurantGuard implements CanActivate {
  constructor(private reflector: Reflector, private dataource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const decorator = this.reflector.get<Role>(
        'restaurant-check',
        context.getHandler(),
      );
      if (isEmpty(decorator) || !decorator) return true;

      const request: Request = context.switchToHttp().getRequest();
      const { restaurantId } = request.params;

      if (restaurantId === ':restaurantId' || !restaurantId)
        throw new BadRequestException('Restaurant Id is required');

      const restaurant = await this.dataource.manager.findOneBy(Restaurant, {
        id: +restaurantId,
      });

      if (!restaurant) throw new NotFoundException('Restaurant does not exist');

      request.restaurant = restaurant;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Unauthorized');
    }
  }
}
