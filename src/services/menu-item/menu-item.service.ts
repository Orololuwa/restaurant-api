import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseState } from 'src/lib/helpers';
import { DataSource } from 'typeorm';
import { MenuItem } from '../../frameworks/typeorm/entities/menu-item.entity';
// import { OptionalQuery } from 'src/core/types';
// import { RestaurantService } from '../restaurants/restaurants.service';
import { DataSourceGenericService } from '../shared/dataSource-generic.service';
import {
  IGetAllMenuItemsPayload,
  IMenuItemQuery,
} from 'src/core/dtos/menu-item';
import { queryDbByDateFilter } from 'src/lib/utils/db';
import { ErrorService } from '../error/error.service';

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
        { where: { ...options, ...dateQuery } },
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

  // async createMenuItem(body: CreateMenuItemDTO) {
  //   try {
  //     const { restaurantId, ...rest } = body;

  //     const restaurant = (
  //       await this.restaurantService.findOneWith({
  //         id: +restaurantId,
  //       })
  //     ).data;

  //     if (!restaurant) throw new NotFoundException('Restaurant not found');

  //     const created = this.repo.create(rest);

  //     created.restaurant = restaurant;

  //     const menuItem = await this.repo.save(created);

  //     return {
  //       message: `Menu Item (${created.name}) created successfully`,
  //       data: {
  //         menuItem,
  //       },
  //       status: HttpStatus.CREATED,
  //       state: ResponseState.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async find(entityOptions: OptionalQuery<MenuItem>) {
  //   try {
  //     const data = await this.repo.find({ where: entityOptions });

  //     return {
  //       message: 'Menu Item(s) retrieved successfully',
  //       data,
  //       status: HttpStatus.OK,
  //       state: ResponseState.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findOne(id: number) {
  //   try {
  //     const menuItem = await this.repo.findOneBy({ id });

  //     return {
  //       message: 'Menu Item retrieved successfully',
  //       data: {
  //         menuItem,
  //       },
  //       status: HttpStatus.FOUND,
  //       state: ResponseState.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async update(id: number, body: Partial<MenuItem>) {
  //   try {
  //     const found = await this.findOne(id);
  //     const {
  //       data: { menuItem },
  //     } = found;

  //     if (!menuItem) throw new NotFoundException("Menu Item doesn't exist");

  //     Object.assign(menuItem, body);

  //     await this.repo.save(menuItem);

  //     return {
  //       message: 'Menu Item updated successfully',
  //       data: {
  //         menuItem,
  //       },
  //       status: HttpStatus.ACCEPTED,
  //       state: ResponseState.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async delete(id: number) {
  //   try {
  //     const found = await this.findOne(id);

  //     const {
  //       data: { menuItem },
  //     } = found;

  //     if (!menuItem) throw new NotFoundException("Menu Item doesn't exist");

  //     await this.repo.remove(menuItem);

  //     return {
  //       message: 'Menu Item deleted successfully',
  //       data: {
  //         menuItem,
  //       },
  //       status: HttpStatus.ACCEPTED,
  //       state: ResponseState.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
