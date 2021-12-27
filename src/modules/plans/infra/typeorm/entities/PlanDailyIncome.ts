// import User from '@modules/users/infra/typeorm/entities/User';
import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('plans_daily_incomes')
class PlanDailyIncome {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  year: number;

  @Field()
  @Column()
  month: number;

  @Field()
  @Column()
  day: number;

  @Field()
  @Column()
  value: string;

  @Field()
  @Column()
  date_formatted: string;

  @Field()
  @Column()
  applied: boolean;

  @Field()
  accumulated: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}

export default PlanDailyIncome;
