import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { AddRestaurantAddressDTO } from 'src/core/dtos/restaurants/add-restaurant-address.dto';
import { CreateRestaurantDTO } from 'src/core/dtos/restaurants/create-restaurant.dto';
import { Role } from 'src/lib/helpers';
import { RestaurantService } from 'src/services/restaurants/restaurants.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Post()
  @merchantAuth(Role.Merchant)
  createRestaurant(@Body() body: CreateRestaurantDTO, @Req() req: Request) {
    return this.restaurantService.create(body, req.merchant);
  }

  @Patch('address')
  @merchantAuth(Role.Merchant)
  addAddress(@Body() body: AddRestaurantAddressDTO, @Req() req: Request) {
    return this.restaurantService.addAddress(body, req.merchant);
  }
}
