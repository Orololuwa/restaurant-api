import { IsNumber, IsString, IsArray } from 'class-validator';
import { CreateOrderedIngredientDTO } from '../ordered-ingredients/ordered-ingredients.dto';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @IsString()
  deliveryMethod: string;

  @IsArray()
  ingredients: CreateOrderedIngredientDTO[];
}
