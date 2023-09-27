import {
  Body,
  Controller,
  Get,
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
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { Role } from 'src/lib/helpers';
import { IMenuItemBody, IMenuItemQuery } from 'src/core/dtos/menu-item';

@Controller('merchant/menu-item')
export class MenuItemsController {
  constructor(private menuItemService: MenuItemService) {}

  @Get()
  @merchantAuth(Role.Merchant)
  async getAllMenuItems(
    @Query() query: IMenuItemQuery,
    @Res() res: Response,
    @Body() body: IMenuItemBody,
  ) {
    try {
      const { restaurantId } = body;
      const response = await this.menuItemService.getAllMenuItems({
        query,
        options: { restaurant: { id: +restaurantId } as any },
      });
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  // @Post()
  // @merchantAuth(Role.Merchant)
  // async createMenuItem(@Body() body: CreateMenuItemDTO, @Res() res: Response) {
  //   try {
  //     const response = await this.menuItemService.create(body);
  //     return res.status(response.status).json(response);
  //   } catch (error) {
  //     return res.status(error.status || 500).json(error.response);
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
  //     return res.status(error.status || 500).json(error.response);
  //   }
  // }

  // @Delete('/:id')
  // @merchantAuth(Role.Merchant)
  // async deleteMenuItem(@Param('id') id: string, @Res() res: Response) {
  //   try {
  //     const response = await this.menuItemService.delete(+id);
  //     return res.status(response.status).json(response);
  //   } catch (error) {
  //     return res.status(error.status || 500).json(error.response);
  //   }
  // }
}
