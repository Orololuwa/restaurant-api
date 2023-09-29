import { MenuItemStatus } from 'src/lib/helpers/menu-items';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItemPurchase } from './menu-item-purchase.entity';
import { Restaurant } from './restaurants.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  image: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => MenuItemPurchase,
    (menuItemPurchase) => menuItemPurchase.menuItem,
  )
  menuItemPurchase: MenuItem;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems)
  restaurant: Restaurant;

  @Column({ nullable: true })
  slug: string;

  @Column()
  category: string;

  @Column({ default: MenuItemStatus.ACTIVE })
  status: string;

  @Column({ default: false })
  isDeleted: boolean;
}
