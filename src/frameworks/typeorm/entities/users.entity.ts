import { Order } from 'src/frameworks/typeorm/entities/orders.entity';
import { Role } from 'src/lib/helpers';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryDetails } from './delivery-details.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: Role.User })
  role: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];

  @OneToMany(() => DeliveryDetails, (deliveryDetails) => deliveryDetails.user)
  deliveryDetails: DeliveryDetails;
}
