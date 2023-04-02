import { MenuItemPurchase } from 'src/frameworks/typeorm/entities/menu-item-purchase.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderModel } from '../models/orders.model';
import { Address } from './address.entity';

@Entity()
export class Order implements OrderModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  price: number;

  @Column()
  deliveryMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => MenuItemPurchase,
    (menuItemPurchase) => menuItemPurchase.order,
  )
  menuItemPurchase: MenuItemPurchase;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Address, (address) => address.order)
  address: Address;
}
