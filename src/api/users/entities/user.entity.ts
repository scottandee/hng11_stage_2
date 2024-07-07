import { Organisation } from '../../../api/organisations/entities/organisation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string; // must be unique

  @Column({ nullable: false })
  firstName: string; // must not be null

  @Column({ nullable: false })
  lastName: string; // must not be null

  @Column({ unique: true, nullable: false })
  email: string; // must be unique and must not be null

  @Column({ nullable: false })
  password: string; // must not be null

  @Column({ nullable: true })
  phone: string;

  @ManyToMany(() => Organisation, (organisation) => organisation.users)
  @JoinTable()
  organisations: Organisation[];
}
