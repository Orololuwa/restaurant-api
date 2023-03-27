import { IsEnum, IsNumber } from 'class-validator';
import { IngredientType } from 'src/lib/helpers/ingredients';

export class CreateOrderedIngredientDTO {
  @IsEnum(IngredientType)
  ingredient: IngredientType;

  @IsNumber()
  count: number;
}
