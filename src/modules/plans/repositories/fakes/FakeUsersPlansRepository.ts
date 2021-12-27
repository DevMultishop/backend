import { v4 } from 'uuid';
import ICreateUserPlanDTO from '../../dtos/ICreateUserPlanDTO';
import UserPlan from '../../infra/typeorm/entities/UserPlan';
import IUsersPlansRepository from '../IUsersPlansRepository';

class FakeUsersPlansRepository implements IUsersPlansRepository {
  private userPlans: UserPlan[] = [];

  public async create({
    limit_usd_cents,
    plan_id,
    progress_usd_cents,
    user_id,
  }: ICreateUserPlanDTO): Promise<UserPlan> {
    const plan = new UserPlan();
    Object.assign(plan, {
      id: v4(),
      created_at: new Date(),
      limit_usd_cents,
      plan_id,
      progress_usd_cents,
      user_id,
      filled_at: null,
    });
    this.userPlans.push(plan);
    return plan;
  }

  public async save(userPlan: UserPlan): Promise<UserPlan> {
    const index = this.userPlans.findIndex(p => p.id === userPlan.id);
    this.userPlans[index] = userPlan;

    return userPlan;
  }

  public async findNotFilledByUserId(user_id: string): Promise<UserPlan[]> {
    return this.userPlans.filter(p => !p.filled_at && p.user_id === user_id);
  }

  public async findById(id: string): Promise<UserPlan | undefined> {
    return this.userPlans.find(p => p.id === id);
  }
}
export default FakeUsersPlansRepository;
