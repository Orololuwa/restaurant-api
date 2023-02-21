import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderedIngredientDTO } from '../ordered-ingredients/dtos/create-ordered-ingredient';
import { OrderedIngredients } from '../ordered-ingredients/ordered-ingredients.entity';

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
