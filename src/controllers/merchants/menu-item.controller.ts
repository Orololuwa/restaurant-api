import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  // Delete,
  // Body,
  // Param,
  // Patch,
  // Post,
} from '@nestjs/common';
// import { UpdateMenuItemDTO } from '../../core/dtos/menu-item/update-menu-item.dto';
import { MenuItemService } from '../../services/menu-item/menu-item.service';
// import { CreateMenuItemDTO } from 'src/core/dtos/menu-item/create-menu-item.dto';
import { Response } from 'express';
import { isRestaurant, merchantAuth } from 'src/core/decorators';
import { Role } from 'src/lib/helpers';
import { IMenuItemQuery } from 'src/core/dtos/menu-item';
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

  // @Post()
  // @merchantAuth(Role.Merchant)
  // async createMenuItem(@Body() body: CreateMenuItemDTO, @Res() res: Response) {
  //   try {
  //     const response = await this.menuItemService.create(body);
  //     return res.status(response.status).json(response);
  //   } catch (error) {
  //     return res.status(error.status || 500).json(error);
  //   }
  // }

  // @Patch('/:id')
  // @merchantAuth(Role.Merchant)
  // async updateMenuItem(
  //   @Param('id') id: string,
  //   @Body() body: UpdateMenuItemDTO,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const response = await this.menuItemService.update(+id, body);
  //     return res.status(response.status).json(response);
  //   } catch (error) {
  //     return res.status(error.status || 500).json(error);
  //   }
  // }

  // @Delete('/:id')
  // @merchantAuth(Role.Merchant)
  // async deleteMenuItem(@Param('id') id: string, @Res() res: Response) {
  //   try {
  //     const response = await this.menuItemService.delete(+id);
  //     return res.status(response.status).json(response);
  //   } catch (error) {
  //     return res.status(error.status || 500).json(error);
  //   }
  // }
}
