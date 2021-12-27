import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_passwords')
class UserPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  type: 'login' | 'financial';

  @Column()
  password_hash: string;

  @UpdateDateColumn()
  updated_at: Date;
}
export default UserPassword;
