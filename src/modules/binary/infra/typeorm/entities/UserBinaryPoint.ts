import { format } from 'date-fns';
import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from '../../../../users/infra/typeorm/entities/User';

@ObjectType()
@Entity('users_binary_points')
class UserBinaryPoint {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  user_id: string;

  @Field()
  @Column()
  position: 'left' | 'right';

  @Field(() => String)
  get formatted_position(): string {
    return this.position === 'left' ? 'Left' : 'Right';
  }

  @Field()
  @Column()
  points: number;

  @Field()
  @Column()
  from_user_id: string;

  @Field()
  @OneToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  from_user: User;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  get formatted_date(): string {
    return format(this.created_at, 'dd/MM/yyyy HH:mm');
  }
}

export default UserBinaryPoint;
