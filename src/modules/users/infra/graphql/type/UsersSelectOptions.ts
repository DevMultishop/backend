import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class UsersSelectOptions {
  @Field()
  value: string;

  @Field()
  label: string;
}
export default UsersSelectOptions;
