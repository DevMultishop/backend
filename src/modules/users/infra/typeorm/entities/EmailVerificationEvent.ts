import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('emails_verification_events')
class EmailVerificationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  full_name: string;

  @Column()
  indicator_id: string;

  @CreateDateColumn()
  created_at: Date;
}
export default EmailVerificationEvent;
