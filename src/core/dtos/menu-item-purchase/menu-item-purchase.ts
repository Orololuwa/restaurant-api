import { IsEnum, IsNumber } from 'class-validator';
import { IngredientType } from 'src/lib/helpers/ingredients';

export class CreateMenuItemPurchaseDTO {
  @IsEnum(IngredientType)
  menuItem: IngredientType;

  @IsNumber()
  quantity: number;

  @IsNumber()
  packNumber: number;

  @IsNumber()
  pricePurchased: number;
}
