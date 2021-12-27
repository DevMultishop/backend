import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('unilevel_nodes')
class UnilevelNode {
  @Field()
  @PrimaryColumn()
  user_id: string;

  @Field()
  @Column()
  indicator_id: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
export default UnilevelNode;
