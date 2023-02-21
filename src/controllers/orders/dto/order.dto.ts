import { Expose, Transform } from 'class-transformer';
import { OrderedIngredients } from 'src/controllers/ordered-ingredients/ordered-ingredients.entity';
import { User } from 'src/controllers/users/users.entity';

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

  @Expose()
  @Transform(({ obj }) => obj.user)
  user: User;
}
