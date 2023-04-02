import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemPurchase } from 'src/frameworks/typeorm/entities/menu-item-purchase.entity';
import { CreateMenuItemPurchaseDTO } from 'src/core/dtos/menu-item-purchase/menu-item-purchase';
import { Order } from 'src/frameworks/typeorm/entities/orders.entity';

@Injectable()
export class MenuItemPurchaseService {
  constructor(
    @InjectRepository(MenuItemPurchase)
    private repo: Repository<MenuItemPurchase>,
  ) {}

  async create(body: Partial<CreateMenuItemPurchaseDTO>, order: Order) {
    try {
      const menuItemPurchase = this.repo.create({
        ...body,
      });

      menuItemPurchase.order = order;

      console.log(menuItemPurchase);

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
