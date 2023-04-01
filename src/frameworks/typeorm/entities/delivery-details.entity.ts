import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeliveryDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  houseNumber: string;

  @Column()
  street: number;

  @Column()
  city: number;

  @Column()
  state: number;

  @Column()
  zipCode: number;

  @Column({ default: false })
  primaryAddress: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
