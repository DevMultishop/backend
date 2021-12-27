import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('users')
class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  full_name: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  phone_number: string;

  @Field()
  @Column()
  email: string;

  @Field()
  get avatar_url(): string {
    return `https://ui-avatars.com/api/?background=c2c2c2&color=fff&name=${this.full_name}`;
  }

  @UpdateDateColumn()
  updated_at: Date;
}
export default User;
