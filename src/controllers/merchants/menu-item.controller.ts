import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Delete,
  Body,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { MenuItemService } from '../../services/menu-item/menu-item.service';
import { Request, Response } from 'express';
import { isRestaurant, merchantAuth } from 'src/core/decorators';
import { Role } from 'src/lib/helpers';
import {
  CreateMenuItemDTO,
  CreateMenuItemPayload,
  EditMenuItemDTO,
  IMenuItemQuery,
} from 'src/core/dtos/menu-item';
import { IGenericRestaurantIdParam } from 'src/core/dtos';

@Controller('merchant/:restaurantId/menu-item')
export class MenuItemsController {
  constructor(private menuItemService: MenuItemService) {}

  @Get()
  @merchantAuth(Role.Merchant)
  @isRestaurant()
  async getAllMenuItems(
    @Query() query: IMenuItemQuery,
    @Res() res: Response,
    @Param() param: IGenericRestaurantIdParam,
  ) {
    try {
      const { restaurantId } = param;
      const response = await this.menuItemService.getAllMenuItems({
        query,
        options: { restaurant: { id: +restaurantId } as any },
      });
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Get('/:id')
  @merchantAuth(Role.Merchant)
  @isRestaurant()
  async getAMenuItem(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.menuItemService.getAMenuItem(+id);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Post()
  @merchantAuth(Role.Merchant)
  @isRestaurant()
  async createMenuItem(
    @Body() body: CreateMenuItemDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const payload: CreateMenuItemPayload = {
        body,
        restaurant: req.restaurant,
      };
      const response = await this.menuItemService.createMenuItem(payload);
      return res.status(response.status).json(response);
    } catch (error) {
      console.warn('@createMenuItem Controller', { error });
      return res.status(error.status || 500).json(error);
    }
  }

  @Patch('/:id')
  @merchantAuth(Role.Merchant)
  @isRestaurant()
  async updateMenuItem(
    @Param('id') id: string,
    @Body() body: EditMenuItemDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await this.menuItemService.editMenuItem(+id, body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Delete('/:id')
  @merchantAuth(Role.Merchant)
  @isRestaurant()
  async deleteMenuItem(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.menuItemService.deleteMenuItem(+id);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }
}
