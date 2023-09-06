import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuItemDTO } from 'src/core/dtos/menu-item/create-menu-item.dto';
import { ResponseState } from 'src/lib/helpers';
import { Repository } from 'typeorm';
import { MenuItem } from '../../frameworks/typeorm/entities/menu-item.entity';
import { OptionalQuery } from 'src/core/types';
import { RestaurantService } from '../restaurants/restaurants.service';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem) private repo: Repository<MenuItem>,
    private restaurantService: RestaurantService,
  ) {}

  async create(body: CreateMenuItemDTO) {
    try {
      const { restaurantId, ...rest } = body;

      const restaurant = (
        await this.restaurantService.findOneWith({
          id: +restaurantId,
        })
      ).data;

      if (!restaurant) throw new NotFoundException('Restaurant not found');

      const created = this.repo.create(rest);

      created.restaurant = restaurant;

      const menuItem = await this.repo.save(created);

      return {
        message: `Menu Item (${created.name}) created successfully`,
        data: {
          menuItem,
        },
        status: HttpStatus.CREATED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async find(entityOptions: OptionalQuery<MenuItem>) {
    try {
      const data = await this.repo.find({ where: entityOptions });

      return {
        message: 'Menu Item(s) retrieved successfully',
        data,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const menuItem = await this.repo.findOneBy({ id });

      return {
        message: 'Menu Item retrieved successfully',
        data: {
          menuItem,
        },
        status: HttpStatus.FOUND,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, body: Partial<MenuItem>) {
    try {
      const found = await this.findOne(id);
      const {
        data: { menuItem },
      } = found;

      if (!menuItem) throw new NotFoundException("Menu Item doesn't exist");

      Object.assign(menuItem, body);

      await this.repo.save(menuItem);

      return {
        message: 'Menu Item updated successfully',
        data: {
          menuItem,
        },
        status: HttpStatus.ACCEPTED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const found = await this.findOne(id);

      const {
        data: { menuItem },
      } = found;

      if (!menuItem) throw new NotFoundException("Menu Item doesn't exist");

      await this.repo.remove(menuItem);

      return {
        message: 'Menu Item deleted successfully',
        data: {
          menuItem,
        },
        status: HttpStatus.ACCEPTED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
