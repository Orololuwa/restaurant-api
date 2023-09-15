import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Merchant } from './merchants.entity';
import { MenuItem } from './menu-item.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  linkedIn: string;

  @Column({ nullable: true })
  facebook: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.restaurant)
  merchant: Merchant;

  @OneToMany(() => MenuItem, (menuItems) => menuItems.restaurant)
  menuItems: MenuItem;
}
