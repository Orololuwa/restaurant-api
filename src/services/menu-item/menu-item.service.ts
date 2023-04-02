import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuItemDTO } from 'src/core/dtos/menu-item/create-menu-item.dto';
import { ResponseState } from 'src/lib/helpers';
import { Repository } from 'typeorm';
import { MenuItem } from '../../frameworks/typeorm/entities/menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(@InjectRepository(MenuItem) private repo: Repository<MenuItem>) {}

  async create(body: CreateMenuItemDTO) {
    try {
      const existing = await this.find({ name: body.name });

      if (existing.data.length) {
        throw new BadRequestException(`Menu Item (${body.name}) exists`);
      }

      const created = this.repo.create(body);

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

  async find({ name }: { name: string }) {
    try {
      const menuItems = await this.repo.find({ where: { name } });
      return {
        message: 'Menu Item(s) retrieved successfully',
        data: menuItems,
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
