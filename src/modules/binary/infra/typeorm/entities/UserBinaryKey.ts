import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity('users_binary_keys')
class UserBinaryKey {
  @Field()
  @PrimaryColumn()
  user_id: string;

  @Field()
  @Column()
  position: 'left' | 'right' | 'automatic';

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}

export default UserBinaryKey;
