import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Plan from './Plan';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('users_plans')
class UserPlan {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Field()
  @Column()
  plan_id: string;

  @OneToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Field()
  @Column()
  limit_usd_cents: number;

  @Field()
  @Column()
  progress_usd_cents: number;

  @Field()
  @Column()
  filled_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => String)
  get formatted_limit_usd_value(): string {
    return FormatUSD(Number(this.limit_usd_cents) * 0.01);
  }

  @Field(() => String)
  get formatted_progress_usd_value(): string {
    return FormatUSD(Number(this.progress_usd_cents) * 0.01);
  }
}
export default UserPlan;
