import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './orders.entity';

@Entity()
export class OrderedIngredients {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: 0 })
  count: number;

  @Column()
  ingredient: string;

  @ManyToOne(() => Order, (order) => order.ingredients)
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
