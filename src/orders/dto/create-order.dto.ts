import { IsNumber, IsString, IsEmail, IsObject } from 'class-validator';
import { CreateOrderedIngredientDTO } from 'src/ordered-ingredients/dtos/create-ordered-ingredient';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @IsString()
  deliveryMethod: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsObject()
  ingredients: CreateOrderedIngredientDTO;
}
