import { OrderedIngredients } from 'src/frameworks/typeorm/entities/ordered-ingredients.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  deliveryMethod: string;

  @OneToOne(() => OrderedIngredients)
  @JoinColumn()
  ingredients: OrderedIngredients;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
