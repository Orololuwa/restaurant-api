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
import { merchantAuth } from 'src/core/decorators';
import { CreateAddressDTO } from 'src/core/dtos/address/create-address.dto';
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
  async createRestaurant(
    @Body() body: CreateRestaurantDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const response = await this.restaurantService.create(body, req.merchant);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Get()
  @merchantAuth(Role.Merchant)
  async getRestaurants(@Req() request: Request, @Res() res: Response) {
    try {
      const response = await this.restaurantService.findAll({
        merchant: request.merchant,
      });

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Get('/:id')
  @merchantAuth(Role.Merchant)
  async getARestaurant(
    @Req() request: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const response = await this.restaurantService.findOneWith({
        merchant: request?.merchant,
        id,
      });

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Post('address/:id')
  @merchantAuth(Role.Merchant)
  async addAddress(
    @Body() body: CreateAddressDTO,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const payload: AddRestaurantAddressDTO = { id, address: body };
      const response = await this.restaurantService.addAddress(payload);

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Patch('address/:id')
  @merchantAuth(Role.Merchant)
  async editAddress(
    @Body() body: CreateAddressDTO,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const payload: AddRestaurantAddressDTO = { id, address: body };
      const response = await this.restaurantService.editAddress(payload);

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Patch(':id')
  @merchantAuth(Role.Merchant)
  async updateRestaurant(
    @Body() body: EditRestaurantDTO,
    @Req() req: Request,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await this.restaurantService.update(
        id,
        body,
        req.merchant,
      );

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }
}
