import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UpdateMenuItemDTO } from '../core/dtos/menu-item/update-menu-item.dto';
import { MenuItemService } from '../services/menu-item/menu-item.service';
import { CreateMenuItemDTO } from 'src/core/dtos/menu-item/create-menu-item.dto';
import { Response } from 'express';
import { auth } from 'src/core/decorators/auth.decorator';
import { Role } from 'src/lib/helpers';

@Controller('menu-item')
export class MenuItemsController {
  constructor(private menuItemService: MenuItemService) {}

  @Get()
  @auth(Role.User)
  async getAllMenuItems(
    @Query() query: { name: string },
    @Res() res: Response,
  ) {
    try {
      const { name } = query;
      const response = await this.menuItemService.find({ name });
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Post()
  async createMenuItem(@Body() body: CreateMenuItemDTO, @Res() res: Response) {
    try {
      const response = await this.menuItemService.create(body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Patch('/:id')
  async updateMenuItem(
    @Param('id') id: string,
    @Body() body: UpdateMenuItemDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await this.menuItemService.update(+id, body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Delete('/:id')
  async deleteMenuItem(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.menuItemService.delete(+id);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }
}
