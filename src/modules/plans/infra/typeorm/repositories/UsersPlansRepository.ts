import { getRepository, IsNull } from 'typeorm';
import ICreateUserPlanDTO from '../../../dtos/ICreateUserPlanDTO';
import IUsersPlansRepository from '../../../repositories/IUsersPlansRepository';
import UserPlan from '../entities/UserPlan';

class UsersPlansRepository implements IUsersPlansRepository {
  constructor(private ormRepository = getRepository(UserPlan)) {}

  public async create({
    limit_usd_cents,
    plan_id,
    progress_usd_cents,
    user_id,
  }: ICreateUserPlanDTO): Promise<UserPlan> {
    const plan = this.ormRepository.create({
      limit_usd_cents: Math.round(limit_usd_cents),
      plan_id,
      progress_usd_cents: Math.round(progress_usd_cents),
      user_id,
    });
    await this.ormRepository.save(plan);
    return plan;
  }

  public async save(userPlan: UserPlan): Promise<UserPlan> {
    return this.ormRepository.save(userPlan);
  }

  public async findNotFilledByUserId(user_id: string): Promise<UserPlan[]> {
    return this.ormRepository.find({
      where: {
        user_id,
        filled_at: IsNull(),
      },
      relations: ['plan'],
    });
  }

  public async findById(id: string): Promise<UserPlan | undefined> {
    return this.ormRepository.findOne(id);
  }
}
export default UsersPlansRepository;
