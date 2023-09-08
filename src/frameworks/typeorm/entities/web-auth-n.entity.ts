import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WebAuthN {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicKey: string;

  @Column()
  credentialId: string;
}
