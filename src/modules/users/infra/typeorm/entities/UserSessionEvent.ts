import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('users_sessions_events')
class UserSessionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Field()
  @Column()
  token: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
export default UserSessionEvent;
