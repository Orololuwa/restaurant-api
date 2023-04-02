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

@Entity()
export class Order implements OrderModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  price: number;

  @Column()
  deliveryMethod: string;

  @OneToMany(
    () => MenuItemPurchase,
    (menuItemPurchase) => menuItemPurchase.order,
  )
  menuItemPurchase: MenuItemPurchase;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
