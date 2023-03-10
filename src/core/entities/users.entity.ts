import { Order } from 'src/core/entities/orders.entity';
import { Role } from 'src/lib/helpers';
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

  @Column({ default: Role.User })
  role: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];
}
