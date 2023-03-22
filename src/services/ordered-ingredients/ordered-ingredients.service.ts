import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderedIngredients } from 'src/frameworks/typeorm/entities/ordered-ingredients.entity';
import { CreateOrderedIngredientDTO } from 'src/core/dtos/ordered-ingredients/ordered-ingredients.controller';

@Injectable()
export class OrderedIngredientsService {
  constructor(
    @InjectRepository(OrderedIngredients)
    private repo: Repository<OrderedIngredients>,
  ) {}

  create(ingredients: Partial<CreateOrderedIngredientDTO>) {
    const orderedIngredient = this.repo.create(ingredients);

    return this.repo.save(orderedIngredient);
  }
}
