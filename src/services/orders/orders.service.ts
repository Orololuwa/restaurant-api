import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItemPurchaseService } from 'src/services/menu-item-purchase/menu-item-purchase.service';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/core/dtos/orders/create-order.dto';
import { Order } from 'src/frameworks/typeorm/entities/orders.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';
import { AddressService } from '../delivery-details/address.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private menuItemPurchaseService: MenuItemPurchaseService,
    private addressService: AddressService,
  ) {}

  async create(body: CreateOrderDTO, user: User) {
    try {
      const { ingredients, addressId, ...rest } = body;
      const order = this.repo.create(rest);

      if (!order) {
        return Promise.reject({
          message: 'Error creating order',
          error: 'BadRequest',
          status: HttpStatus.BAD_REQUEST,
          state: ResponseState.ERROR,
        });
      }

      const address = (await this.addressService.updatePrimary(addressId, user))
        .data;

      order.address = address;
      order.user = user;

      await this.repo.save(order);

      ingredients.map(async (menuItem) => {
        await this.menuItemPurchaseService.create(menuItem, order);
      });

      delete order.user;

      return {
        message: 'Order created successfully',
        data: order,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async find(user: User) {
    const orders = await this.repo
      .createQueryBuilder('orders')
      .where({ user })
      .leftJoinAndSelect('orders.menuItemPurchase', 'menuItemPurchase')
      .select([
        'orders.id',
        'orders.price',
        'orders.deliveryMethod',
        'menuItemPurchase.id',
        'menuItemPurchase.quantity',
        'menuItemPurchase.menuItem',
      ])
      .getMany();
    // .find({
    //   where: { user },
    //   relations: {
    //     menuItemPurchase: true,
    //   },
    // });

    return {
      message: 'Orders retrieved successfully',
      data: orders,
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
  }

  async findOne(id: string, user: User) {
    try {
      if (!id)
        return Promise.reject({
          message: 'Please provide a valid Id',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      const order = await this.repo.findOne({
        where: { id, user },
        relations: { menuItemPurchase: { menuItem: true }, address: true },
      });

      if (!order)
        return Promise.reject({
          message: 'Order not found',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      return {
        message: 'Order retrieved successfully',
        data: order,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    if (!id)
      return Promise.reject({
        message: 'Please provide a valid Id',
        error: 'NotFound',
        status: HttpStatus.NOT_FOUND,
        state: ResponseState.ERROR,
      });

    const order = await this.repo.findOneBy({ id });

    await this.repo.remove(order);

    return {
      message: 'Order deleted successfully',
      data: order,
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
  }
}
