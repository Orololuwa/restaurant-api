import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { AddRestaurantAddressDTO } from 'src/core/dtos/restaurants/add-restaurant-address.dto';
import { CreateRestaurantDTO } from 'src/core/dtos/restaurants/create-restaurant.dto';
import { EditRestaurantDTO } from 'src/core/dtos/restaurants/edit-restaurant.dto';
import { Role } from 'src/lib/helpers';
import { RestaurantService } from 'src/services/restaurants/restaurants.service';

@Controller('merchant/restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Post()
  @merchantAuth(Role.Merchant)
  createRestaurant(@Body() body: CreateRestaurantDTO, @Req() req: Request) {
    return this.restaurantService.create(body, req.merchant);
  }

  @Get()
  @merchantAuth(Role.Merchant)
  async getRestaurants(@Req() request: Request, @Res() res: Response) {
    const response = await this.restaurantService.findAll({
      merchant: request.merchant,
    });

    return res.status(response.status).json(response);
  }

  @Get('/:id')
  @merchantAuth(Role.Merchant)
  async getARestaurant(
    @Req() request: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    const response = await this.restaurantService.findOneWith({
      merchant: request?.merchant,
      id,
    });

    return res.status(response.status).json(response);
  }

  @Patch('address')
  @merchantAuth(Role.Merchant)
  addAddress(@Body() body: AddRestaurantAddressDTO, @Req() req: Request) {
    return this.restaurantService.addAddress(body, req.merchant);
  }

  @Patch(':id')
  @merchantAuth(Role.Merchant)
  updateRestaurant(
    @Body() body: EditRestaurantDTO,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return this.restaurantService.update(id, body, req.merchant);
  }

  @Get('test/one-to-one')
  async testOneToOne(@Res() res: Response) {
    try {
      console.log('one');
      const response = await this.restaurantService.testOneToOne();

      return res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
    }
  }
}
