import { IsNumber, IsString, IsEmail, IsObject } from 'class-validator';
import { CreateOrderedIngredientDTO } from '../ordered-ingredients/ordered-ingredients.controller';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @IsString()
  deliveryMethod: string;

  @IsObject()
  ingredients: CreateOrderedIngredientDTO;
}
