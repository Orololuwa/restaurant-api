import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { User } from './users.entity';

@Entity()
export class DeliveryDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  houseNumber: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: number;

  @Column({ default: true })
  primaryAddress: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.deliveryDetails)
  user: User;

  @OneToMany(() => Order, (order) => order.deliveryDetails)
  order: Order;
}
