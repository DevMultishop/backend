import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import BigNumber from 'bignumber.js';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('users_bitcoin_deposits_events')
class UserBitcoinDepositEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  usd_cents: number;

  @Column()
  satoshis: number;

  @Field()
  @Column()
  btc_usd_conversion: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  get formatted_usd_value(): string {
    return FormatUSD(Number(this.usd_cents) * 0.01);
  }

  @Field(() => String)
  get formatted_btc_usd_conversion(): string {
    return FormatUSD(this.btc_usd_conversion);
  }

  @Field(() => String)
  get formatted_btc_amount(): string {
    return new BigNumber(this.satoshis).times(0.00000001).toFixed();
  }
}
export default UserBitcoinDepositEvent;
