import { IsNumber } from 'class-validator';

export class CreateOrderedIngredientDTO {
  @IsNumber()
  salad: number;

  @IsNumber()
  bacon: number;

  @IsNumber()
  cheese: number;

  @IsNumber()
  meat: number;
}
