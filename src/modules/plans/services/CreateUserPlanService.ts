import { inject, injectable } from 'tsyringe';
import BigNumber from 'bignumber.js';
import IUsersPlansRepository from '../repositories/IUsersPlansRepository';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';
import IPlansRepository from '../repositories/IPlansRepository';
import Transfer from '../../balances/infra/typeorm/entities/Transfer';

interface IParams {
  user_id: string;
  plan_id: string;
}

@injectable()
class CreateUserPlanService {
  constructor(
    @inject('UsersPlansRepository')
    private usersPlansRepository: IUsersPlansRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('BalanceTransferQueue')
    private balanceTransferQueue: IQueue,
  ) {}

  public async execute({ plan_id, user_id }: IParams): Promise<number> {
    const plan = await this.plansRepository.findById(plan_id);
    if (!plan) throw new Error('Plan not found');

    const [ownedUserPlan] =
      await this.usersPlansRepository.findNotFilledByUserId(user_id);

    let upgrade_discount = 0;

    if (ownedUserPlan) {
      const ownedPlan = await this.plansRepository.findById(
        ownedUserPlan.plan_id,
      );
      if (!ownedPlan) throw new Error('Plan not found');
      if (
        new BigNumber(ownedPlan.usd_cents).isGreaterThanOrEqualTo(
          plan.usd_cents,
        )
      )
        throw new Error('You can not buy a cheaper plan');

      upgrade_discount = ownedPlan.usd_cents;
    }

    const creditWithdrawalCents = new BigNumber(plan.usd_cents)
      .minus(upgrade_discount)
      .toNumber();

    const creditWithdrawal = await this.balanceTransferQueue.add<
      Transfer | undefined
    >({
      user_id,
      usd_cents: creditWithdrawalCents * -1,
      description: `Plan purchase ${plan.name}`,
      card: 'credit',
    });

    if (!creditWithdrawal)
      throw new Error('Something went wrong, check your credit balance');

    await this.balanceTransferQueue.add<Transfer | undefined>({
      user_id,
      usd_cents: creditWithdrawalCents,
      description: `Plan purchase ${plan.name}`,
      card: 'applied',
    });

    const limit_usd_cents = new BigNumber(plan.usd_cents)
      .multipliedBy(2)
      .toNumber();

    if (ownedUserPlan) {
      ownedUserPlan.plan_id = plan_id;
      ownedUserPlan.limit_usd_cents = Math.round(limit_usd_cents);
      await this.usersPlansRepository.save(ownedUserPlan);

      return creditWithdrawalCents;
    }

    await this.usersPlansRepository.create({
      user_id,
      plan_id,
      limit_usd_cents: Math.round(limit_usd_cents),
      progress_usd_cents: 0,
    });
    return creditWithdrawalCents;
  }
}
export default CreateUserPlanService;
