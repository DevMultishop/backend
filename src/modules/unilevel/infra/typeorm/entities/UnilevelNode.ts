import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import User from '../../../../users/infra/typeorm/entities/User';

@ObjectType()
@Entity('unilevel_nodes')
class UnilevelNode {
  @Field()
  @PrimaryColumn()
  user_id: string;

  @Field()
  @Column()
  indicator_id: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
export default UnilevelNode;
