import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { IngredientType } from 'src/lib/helpers/ingredients';

export class CreateIngredientDTO {
  @IsEnum(IngredientType)
  name: IngredientType;

  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  price: number;
}
