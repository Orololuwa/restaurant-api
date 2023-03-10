import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderedIngredients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  salad: number;

  @Column({ default: 0 })
  bacon: number;

  @Column({ default: 0 })
  cheese: number;

  @Column({ default: 0 })
  meat: number;
}
