import { IsEnum, IsNumber } from 'class-validator';
import { IngredientType } from 'src/lib/helpers/ingredients';

export class CreateMenuItemPurchaseDTO {
  @IsEnum(IngredientType)
  ingredient: IngredientType;

  @IsNumber()
  count: number;
}
