import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateOrderedIngredientDTO } from '../ordered-ingredients/ordered-ingredients.dto';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @IsString()
  deliveryMethod: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderedIngredientDTO)
  ingredients: CreateOrderedIngredientDTO[];
}
