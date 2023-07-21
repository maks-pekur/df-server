import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 12, unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;
}
