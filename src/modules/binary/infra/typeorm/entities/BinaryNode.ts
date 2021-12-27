import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from '../../../../users/infra/typeorm/entities/User';

@ObjectType()
@Entity('binary_nodes')
class BinaryNode {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  user_id: string;

  @Field()
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field({ nullable: true })
  @Column()
  higher_id?: string;

  @Field()
  @Column()
  position: 'left' | 'right';

  @Field()
  @Column()
  depth: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}

export default BinaryNode;
