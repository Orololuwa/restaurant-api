import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive,  } from 'class-validator';

export class UpdateIngredientCountDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  price: number;
}
