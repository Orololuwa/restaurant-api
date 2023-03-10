import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderedIngredientsService } from 'src/services/ordered-ingredients/ordered-ingredients.service';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/controllers/orders/dto/create-order.dto';
import { Order } from 'src/core/entities/orders.entity';
import { User } from 'src/core/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private orderedIngredientsService: OrderedIngredientsService,
  ) {}

  async create(body: CreateOrderDTO, user: User) {
    const order = this.repo.create({
      price: body.price,
      deliveryMethod: body.deliveryMethod,
    });

    const ingredients = await this.orderedIngredientsService.create(
      body.ingredients,
    );

    if (!order || !ingredients) {
      return Promise.reject({
        message: 'Error creating order',
        error: 'BadRequest',
        status: HttpStatus.BAD_REQUEST,
        state: ResponseState.ERROR,
      });
    }

    order.ingredients = ingredients;

    order.user = user;

    await this.repo.save(order);

    delete order.user;

    return {
      message: 'Order created successfully',
      data: {
        order,
      },
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
  }

  async find(user: User) {
    const orders = await this.repo
      .createQueryBuilder('orders')
      .where({ user })
      .leftJoinAndSelect('orders.user', 'user')
      .select([
        'orders.id',
        'orders.price',
        'orders.deliveryMethod',
        'user.id',
        'user.name',
        'user.email',
      ])
      .leftJoinAndSelect('orders.ingredients', 'ingredients')
      .getMany();
    // .find({
    //   where: { user },
    //   relations: {
    //     ingredients: true,
    //     user: true,
    //   },
    // }
    // );

    return {
      message: 'Orders retrieved successfully',
      data: {
        orders: orders,
      },
      status: HttpStatus.FOUND,
      state: ResponseState.SUCCESS,
    };
  }

  async findOne(id: number) {
    if (!id)
      return Promise.reject({
        message: 'Please provide a valid Id',
        error: 'NotFound',
        status: HttpStatus.NOT_FOUND,
        state: ResponseState.ERROR,
      });

    const order = await this.repo.findOneBy({ id });

    return {
      message: 'Order retrieved successfully',
      data: { order },
      status: HttpStatus.FOUND,
      state: ResponseState.SUCCESS,
    };
  }

  async delete(id: number) {
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
      data: { order },
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
  }
}
