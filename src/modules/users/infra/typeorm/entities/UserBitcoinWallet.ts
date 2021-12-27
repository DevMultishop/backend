import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_bitcoin_wallets')
class UserBitcoinWallet {
  @PrimaryColumn()
  user_id: string;

  @Column()
  address: string;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
export default UserBitcoinWallet;
