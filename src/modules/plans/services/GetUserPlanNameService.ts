import { inject, injectable } from 'tsyringe';
import IUsersPlansRepository from '../repositories/IUsersPlansRepository';
import IPlansRepository from '../repositories/IPlansRepository';

interface IParams {
  user_id: string;
}

@injectable()
class GetUserPlanNameService {
  constructor(
    @inject('UsersPlansRepository')
    private usersPlansRepository: IUsersPlansRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ user_id }: IParams): Promise<string> {
    const [userPlan] = await this.usersPlansRepository.findNotFilledByUserId(
      user_id,
    );
    if (!userPlan) return '-';
    const plan = await this.plansRepository.findById(userPlan.plan_id);
    return plan ? plan.name : '-';
  }
}
export default GetUserPlanNameService;
