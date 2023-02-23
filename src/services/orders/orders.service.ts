import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderedIngredientsService } from 'src/services/ingredients/ordered-ingredients.service';
import { CreateUserDTO } from 'src/controllers/users/dtos/dto';
import { UsersService } from 'src/services/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/controllers/orders/dto/create-order.dto';
import { Order } from 'src/controllers/orders/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private usersService: UsersService,
    private orderedIngredientsService: OrderedIngredientsService,
  ) {}

  async create(body: CreateOrderDTO) {
    const order = this.repo.create({
      price: body.price,
      deliveryMethod: body.deliveryMethod,
    });

    const ingredients = await this.orderedIngredientsService.create(
      body.ingredients,
    );

    order.ingredients = ingredients;

    const [savedUser] = await this.usersService.find(body.email);

    if (savedUser) {
      order.user = savedUser;
    } else {
      const user = await this.usersService.create({
        name: body.name,
        email: body.email,
        address: body.address,
      });
      order.user = user;
    }

    return this.repo.save(order);
  }

  find(user: CreateUserDTO) {
    return this.repo
      .createQueryBuilder('orders')
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
    // find({
    //   where: { user },
    //   relations: {
    //     ingredients: true,
    //     user: true,
    //   },
    // });
  }

  findOne(id: number) {
    if (!id) return;
    return this.repo.findOneBy({ id });
  }

  async delete(id: number) {
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('Order not Found');
    }

    return this.repo.remove(order);
  }
}
