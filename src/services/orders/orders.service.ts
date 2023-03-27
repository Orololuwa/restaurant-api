import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderedIngredientsService } from 'src/services/ordered-ingredients/ordered-ingredients.service';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/core/dtos/orders/create-order.dto';
import { Order } from 'src/frameworks/typeorm/entities/orders.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private orderedIngredientsService: OrderedIngredientsService,
  ) {}

  async create(body: CreateOrderDTO, user: User) {
    try {
      const order = this.repo.create({
        price: body.price,
        deliveryMethod: body.deliveryMethod,
      });

      if (!order) {
        return Promise.reject({
          message: 'Error creating order',
          error: 'BadRequest',
          status: HttpStatus.BAD_REQUEST,
          state: ResponseState.ERROR,
        });
      }

      order.user = user;

      await this.repo.save(order);

      body.ingredients.map(async (ingredient) => {
        await this.orderedIngredientsService.create(ingredient, order);
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
      .leftJoinAndSelect('orders.ingredients', 'ingredients')
      .select([
        'orders.id',
        'orders.price',
        'orders.deliveryMethod',
        'ingredients.id',
        'ingredients.count',
        'ingredients.ingredient',
      ])
      .getMany();
    // .find({
    //   where: { user },
    //   relations: {
    //     ingredients: true,
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
    if (!id)
      return Promise.reject({
        message: 'Please provide a valid Id',
        error: 'NotFound',
        status: HttpStatus.NOT_FOUND,
        state: ResponseState.ERROR,
      });

    const order = await this.repo.findOne({
      where: { id, user },
      relations: { ingredients: true },
    });

    const ingredients: any = await this.orderedIngredientsService.find(order);

    return {
      message: 'Order retrieved successfully',
      data: order,
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
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
