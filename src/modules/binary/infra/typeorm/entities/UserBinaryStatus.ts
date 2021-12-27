import { format } from 'date-fns';
import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('users_binary_status')
class UserBinaryStatus {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  user_id: string;

  @Field()
  @Column()
  left_points: number;

  @Field()
  @Column()
  right_points: number;

  @Field()
  @Column()
  bonus_usd_cents: number;

  @Field()
  @Column()
  max_usd_cents: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  get formatted_date(): string {
    return format(this.created_at, 'dd/MM/yyyy');
  }

  @Field(() => String)
  get formatted_bonus_value(): string {
    return FormatUSD(
      Number(Math.min(this.max_usd_cents, this.bonus_usd_cents)) * 0.01,
    );
  }
}

export default UserBinaryStatus;
