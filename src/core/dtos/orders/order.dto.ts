import { Expose, Transform } from 'class-transformer';
import { OrderedIngredients } from 'src/frameworks/typeorm/entities/ordered-ingredients.entity';

export class OrderDTO {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  deliveryMethod: string;

  @Expose()
  @Transform(({ obj }) => obj.ingredients)
  ingredients: OrderedIngredients;
}
