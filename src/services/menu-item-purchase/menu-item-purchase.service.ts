import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemPurchase } from 'src/frameworks/typeorm/entities/menu-item-purchase.entity';
import { CreateMenuItemPurchaseDTO } from 'src/core/dtos/menu-item-purchase/menu-item-purchase';
import { Order } from 'src/frameworks/typeorm/entities/orders.entity';
import { MenuItemService } from '../menu-item/menu-item.service';

@Injectable()
export class MenuItemPurchaseService {
  constructor(
    @InjectRepository(MenuItemPurchase)
    private repo: Repository<MenuItemPurchase>,
    private menuItemService: MenuItemService,
  ) {}

  async create(body: Partial<CreateMenuItemPurchaseDTO>, order: Order) {
    try {
      const { menuItemId, ...rest } = body;

      const menuItem = await this.menuItemService.findOne({
        where: { id: menuItemId },
      });

      if (!menuItem) throw new NotFoundException('Menu Item not found');

      const menuItemPurchase = this.repo.create({
        ...rest,
      });

      menuItemPurchase.order = order;
      menuItemPurchase.menuItem = menuItem;

      return this.repo.save(menuItemPurchase);
    } catch (error) {
      throw error;
    }
  }

  async createBulk(menuItems: Partial<MenuItemPurchase>[]) {
    try {
      await this.repo
        .createQueryBuilder()
        .insert()
        .into(MenuItemPurchase)
        .values(menuItems)
        .execute();
    } catch (error) {
      throw error;
    }
  }

  async find(order: Order) {
    return this.repo.find({ where: { order } });
  }
}
