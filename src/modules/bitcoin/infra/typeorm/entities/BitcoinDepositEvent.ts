import { format } from 'date-fns';
import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Bignumber from 'bignumber.js';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('bitcoin_deposits_events')
class BitcoinDepositEvent {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  txid: string;

  @Column()
  satoshis: number;

  @Field()
  @Column()
  usd_cents: number;

  @Column()
  btc_usd_conversion: number;

  @Field()
  @Column()
  status: 'pending' | 'confirmed';

  @Field(() => String)
  get formatted_status(): string {
    return this.status === 'confirmed'
      ? 'Confirmed'
      : 'Awaiting third block confirmation';
  }

  @Field(() => String)
  get formatted_usd_value(): string {
    return FormatUSD(Number(this.usd_cents) * 0.01);
  }

  @Field(() => String)
  get formatted_date(): string {
    return format(this.created_at, 'dd/MM/yyyy HH:mm');
  }

  @Field(() => String)
  get txid_link(): string {
    return `https://www.blockchain.com/btc/tx/${this.txid}`;
  }

  @Field(() => String)
  get formatted_btc_amount(): string {
    return new Bignumber(this.satoshis).times(0.00000001).toFixed();
  }

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
export default BitcoinDepositEvent;
