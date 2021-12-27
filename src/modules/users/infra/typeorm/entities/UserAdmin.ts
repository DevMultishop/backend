import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users_admins')
class UserAdmin {
  @PrimaryColumn()
  user_id: string;

  @Column()
  is_active: boolean;

  @UpdateDateColumn()
  updated_at: Date;
}
export default UserAdmin;
