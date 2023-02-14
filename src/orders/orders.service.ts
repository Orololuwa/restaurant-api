import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderedIngredientsService } from 'src/ordered-ingredients/ordered-ingredients.service';
import { CreateUserDTO } from 'src/users/dtos/dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order } from './orders.entity';

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
    return this.repo.find({
      where: { user },
      relations: {
        ingredients: true,
        user: true,
      },
    });
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

    return this.repo.delete(order);
  }
}
