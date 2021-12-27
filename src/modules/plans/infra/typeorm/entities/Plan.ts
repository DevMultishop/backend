import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

const { format: FormatUSD } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@ObjectType()
@Entity('plans')
class Plan {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  usd_cents: number;

  @Field()
  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  get formatted_usd_value(): string {
    return FormatUSD(Number(this.usd_cents) * 0.01);
  }
}
export default Plan;
