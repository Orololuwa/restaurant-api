import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { Order } from './orders.entity';

@Entity()
export class MenuItemPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.menuItemPurchase)
  menuItem: MenuItem;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pricePurchased: number;

  @ManyToOne(() => Order, (order) => order.menuItemPurchase)
  order: Order;

  @Column()
  packNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
