import ICreateUserPlanDTO from '../dtos/ICreateUserPlanDTO';
import UserPlan from '../infra/typeorm/entities/UserPlan';

export default interface IUsersPlansRepository {
  create(data: ICreateUserPlanDTO): Promise<UserPlan>;
  save(userPlan: UserPlan): Promise<UserPlan>;
  findNotFilledByUserId(user_id: string): Promise<UserPlan[]>;
  findById(id: string): Promise<UserPlan | undefined>;
}
