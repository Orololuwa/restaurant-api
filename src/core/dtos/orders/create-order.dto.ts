import { IsNumber, IsString, IsEmail, IsObject } from 'class-validator';
import { CreateOrderedIngredientDTO } from 'src/controllers/ordered-ingredients/dtos/create-ordered-ingredient';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @IsString()
  deliveryMethod: string;

  @IsObject()
  ingredients: CreateOrderedIngredientDTO;
}
