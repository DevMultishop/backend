import { format, subDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IUsersPlansRepository from '../../plans/repositories/IUsersPlansRepository';

import UserBinaryStatus from '../infra/typeorm/entities/UserBinaryStatus';
import IUsersBinaryPointsRepository from '../repositories/IUsersBinaryPointsRepository';
import IUsersBinaryStatusRepository from '../repositories/IUsersBinaryStatusRepository';

import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';
import Transfer from '../../balances/infra/typeorm/entities/Transfer';

const POINST_TO_BONUS_PERCENTAGE = 0.08; // 8%
const MAX_BONUS_PLAN_VALUE = 0.5; // 50%

interface IUsersPoints {
  [key: string]: {
    left: number;
    right: number;
  };
}

@injectable()
class CreateDailyBinaryPaymentsService {
  constructor(
    @inject('UsersBinaryPointsRepository')
    private usersBinaryPointsRepository: IUsersBinaryPointsRepository,

    @inject('UsersBinaryStatusRepository')
    private usersBinaryStatusRepository: IUsersBinaryStatusRepository,

    @inject('UsersPlansRepository')
    private usersPlansRepository: IUsersPlansRepository,

    @inject('UserPlansGainsQueue')
    private userPlansGainsQueue: IQueue,
  ) {}

  public async execute(): Promise<UserBinaryStatus[]> {
    const today = new Date();
    const alreadyCreated = await this.usersBinaryStatusRepository.findByDay(
      today,
    );
    if (alreadyCreated.length > 0) return alreadyCreated;

    const yesterday = subDays(today, 1);
    const points = await this.usersBinaryPointsRepository.findByDay(yesterday);

    const usersPoints: IUsersPoints = points.reduce((acc, curr) => {
      if (!acc[curr.user_id]) acc[curr.user_id] = { left: 0, right: 0 };
      acc[curr.user_id][curr.position] += Number(curr.points);
      return acc;
    }, {} as IUsersPoints);

    const yesterdayFormatted = format(yesterday, 'dd/MM/yyyy');

    const binarySatatus = await Promise.all(
      Object.keys(usersPoints).map(async user_id => {
        const [userPlan] =
          await this.usersPlansRepository.findNotFilledByUserId(user_id);
        const max_usd_cents =
          userPlan && userPlan.plan
            ? Number(userPlan.plan.usd_cents) * MAX_BONUS_PLAN_VALUE
            : 0;

        const bonus_usd_cents = Math.min(
          usersPoints[user_id].left * 100,
          usersPoints[user_id].right * 100,
        );

        const payment_usd_cents = Math.min(
          max_usd_cents,
          bonus_usd_cents * POINST_TO_BONUS_PERCENTAGE,
        );
        if (payment_usd_cents > 0)
          await this.userPlansGainsQueue.add<Transfer | undefined>({
            user_id,
            usd_cents: payment_usd_cents,
            description: `Binary Bonus - ${yesterdayFormatted}`,
            card: 'available',
          });

        return this.usersBinaryStatusRepository.create({
          user_id,
          bonus_usd_cents: payment_usd_cents,
          left_points: usersPoints[user_id].left,
          max_usd_cents,
          right_points: usersPoints[user_id].right,
        });
      }),
    );

    return binarySatatus;
  }
}
export default CreateDailyBinaryPaymentsService;
