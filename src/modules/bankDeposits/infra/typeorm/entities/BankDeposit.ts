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
import upload from '../../../../../config/upload';
import User from '../../../../users/infra/typeorm/entities/User';

@ObjectType()
@Entity('users_bank_deposits')
class BankDeposit {
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

  @Field()
  @Column()
  usd_cents: number;

  @Field()
  @Column()
  deposit_slip: string;

  @Field({ nullable: true })
  @Column()
  admin_answear?: string;

  @Field()
  @Column()
  status: 'pending' | 'accepted' | 'rejected';

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => String)
  get deposit_slip_url(): string {
    switch (upload.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.deposit_slip}`;
      default:
        return `https://${upload.config.aws.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${this.deposit_slip}`;
    }
  }
}

export default BankDeposit;
