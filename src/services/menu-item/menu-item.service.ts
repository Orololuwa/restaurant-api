import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseState } from 'src/lib/helpers';
import { DataSource } from 'typeorm';
import { MenuItem } from '../../frameworks/typeorm/entities/menu-item.entity';
import { DataSourceGenericService } from '../shared/dataSource-generic.service';
import {
  CreateMenuItemPayload,
  EditMenuItemDTO,
  IGetAllMenuItemsPayload,
  IMenuItemQuery,
} from 'src/core/dtos/menu-item';
import { queryDbByDateFilter } from 'src/lib/utils/db';
import { ErrorService } from '../error/error.service';
import { slugify } from 'src/lib/utils';
import { Restaurant } from 'src/frameworks/typeorm/entities/restaurants.entity';
import { serializeMenuItem } from 'src/lib/utils/serializers';

@Injectable()
export class MenuItemService extends DataSourceGenericService<MenuItem> {
  constructor(
    // private restaurantService: RestaurantService,
    dataSource: DataSource,
    private errorService: ErrorService,
  ) {
    super(dataSource, MenuItem);
  }

  cleanPageQuery(data: IMenuItemQuery): any {
    let key = {};
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.page) key['page'] = data.page;
    return key;
  }

  cleanDateQuery(data: IMenuItemQuery): any {
    let key = {};
    if (data.to || data.from) {
      const dateQuery = queryDbByDateFilter(data);
      key = { ...key, ...dateQuery };
    }
    return key;
  }

  async getAllMenuItems(payload: IGetAllMenuItemsPayload) {
    try {
      const { query, options } = payload;
      const dateQuery = this.cleanDateQuery(query);
      const pageQuery = this.cleanPageQuery(query);
      const data = await this.findAllWithPagination(
        { where: { isDeleted: false, ...options, ...dateQuery } },
        { ...pageQuery },
      );

      return {
        message: 'Menu Item(s) retrieved successfully',
        ...data,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async getAMenuItem(id: number) {
    try {
      const menuItem = await this.findOne({ where: { id, isDeleted: false } });

      if (!menuItem) throw new NotFoundException('Menu Item not found');

      return {
        message: 'Menu Item retrieved successfully',
        data: menuItem,
        status: HttpStatus.FOUND,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async createMenuItem(payload: CreateMenuItemPayload) {
    try {
      const { restaurant, body } = payload;
      const created = this.create({ ...body, restaurant });

      let data;

      await this.dataSource.transaction(async (manager) => {
        if (body.isNewCategory) {
          const categories = restaurant.menuCategories || [];

          if (!categories.includes(body.category)) {
            (categories as string[]).push(body.category);

            await manager.update(
              Restaurant,
              {},
              { menuCategories: categories as string },
            );
          }
        }

        const menuItem = await this.insert(created, { transaction: manager });

        const slug = slugify(`${menuItem.name} ${menuItem.id}`);

        await this.update(menuItem.id, { slug }, { transaction: manager });

        data = serializeMenuItem({ ...menuItem, slug });
      });

      return {
        message: `Menu Item (${created.name}) created successfully`,
        data,
        status: HttpStatus.CREATED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async editMenuItem(id: number, body: Partial<EditMenuItemDTO>) {
    try {
      const menuItem = await this.findOne({ where: { id, isDeleted: false } });

      if (!menuItem) throw new NotFoundException("Menu Item doesn't exist");

      await this.update(id, { ...body });

      return {
        message: 'Menu Item updated successfully',
        data: {
          id,
        },
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async deleteMenuItem(id: number) {
    try {
      const menuItem = await this.findOne({ where: { id } });

      if (!menuItem) throw new NotFoundException("Menu Item doesn't exist");

      await this.update(id, { isDeleted: true });

      return {
        message: 'Menu Item deleted successfully',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }
}
