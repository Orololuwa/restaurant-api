import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from './restaurants.entity';
import { WebAuthN } from './web-auth-n.entity';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.merchant)
  restaurant: Restaurant;

  @OneToOne(() => WebAuthN)
  @JoinColumn()
  webAuthN: WebAuthN;

  @Column({ default: false })
  isWebAuthEnabled: boolean;
}
