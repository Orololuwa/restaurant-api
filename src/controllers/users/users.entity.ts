import { Order } from 'src/controllers/orders/orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];
}
