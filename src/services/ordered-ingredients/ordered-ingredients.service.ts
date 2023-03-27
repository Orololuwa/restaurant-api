import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderedIngredients } from 'src/frameworks/typeorm/entities/ordered-ingredients.entity';
import { CreateOrderedIngredientDTO } from 'src/core/dtos/ordered-ingredients/ordered-ingredients.dto';
import { Order } from 'src/frameworks/typeorm/entities/orders.entity';

@Injectable()
export class OrderedIngredientsService {
  constructor(
    @InjectRepository(OrderedIngredients)
    private repo: Repository<OrderedIngredients>,
  ) {}

  async create(ingredients: Partial<CreateOrderedIngredientDTO>, order: Order) {
    try {
      const orderedIngredient = this.repo.create(ingredients);

      orderedIngredient.order = order;

      return this.repo.save(orderedIngredient);
    } catch (error) {
      throw error;
    }
  }

  async createBulk(ingredients: Partial<OrderedIngredients>[]) {
    try {
      const orderedIngredient = await this.repo
        .createQueryBuilder()
        .insert()
        .into(OrderedIngredients)
        .values(ingredients)
        .execute();
    } catch (error) {
      throw error;
    }
  }

  async find(order: Order) {
    return this.repo.find({ where: { order } });
  }
}
