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

import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import User from '../../../../users/infra/typeorm/entities/User';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('users_bitcoin_withdrawals')
class UserBitcoinWithdrawal {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  usd_cents: number;

  @Field()
  @Column()
  satoshis: number;

  @Field()
  @Column()
  btc_usd_conversion: number;

  @Field({ nullable: true })
  @Column()
  txid?: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

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

  @Field(() => String)
  get txid_link(): string {
    return `https://www.blockchain.com/btc/tx/${this.txid}`;
  }

  @Field(() => String)
  get formatted_date(): string {
    return format(this.created_at, 'dd/MM/yyyy HH:mm');
  }
}
export default UserBitcoinWithdrawal;
