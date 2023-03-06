import { Expose, Transform, Type } from 'class-transformer';
import { OrderedIngredients } from 'src/controllers/ordered-ingredients/ordered-ingredients.entity';
import { UserDTO } from 'src/controllers/users/dtos/dto';
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
}
