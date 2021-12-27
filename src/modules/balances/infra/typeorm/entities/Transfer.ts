import { format } from 'date-fns';
import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from '../../../../users/infra/typeorm/entities/User';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('transfers')
class Transfer {
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
  card: 'credit' | 'available' | 'income' | 'applied';

  @Field()
  @Column()
  usd_cents: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @UpdateDateColumn()
  created_at: Date;

  @Field(() => String)
  get formatted_usd_value(): string {
    return FormatUSD(Number(this.usd_cents) * 0.01);
  }

  @Field(() => String)
  get formatted_date(): string {
    return format(this.created_at, 'dd/MM/yyyy HH:mm');
  }

  get formatted_date_month(): string {
    return format(this.created_at, 'dd/MM');
  }

  get formatted_description(): string {
    return this.description.includes('Binary Bonus')
      ? 'Binary Bonus'
      : this.description;
  }

  @Field(() => String)
  get color(): string {
    return this.usd_cents > 0 ? 'green' : 'red';
  }
}
export default Transfer;
