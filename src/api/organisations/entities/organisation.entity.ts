import { User } from '../../../api/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'organisations' })
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  orgId: string; // Unique

  @Column({ nullable: false })
  name: string; // Required and cannot be null

  @Column({ default: "" })
  description: string;

  @ManyToMany(() => User, (user) => user.organisations)
  users: User[];
}
