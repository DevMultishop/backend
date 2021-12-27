import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('users_balances')
class UserBalance {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Field()
  @Column()
  card: 'credit' | 'available' | 'income' | 'applied';

  @Field()
  @Column()
  usd_cents: number;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => String)
  get formatted_usd_value(): string {
    return FormatUSD(Number(this.usd_cents) * 0.01);
  }
}
export default UserBalance;
