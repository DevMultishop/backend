import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import { subDays, format } from 'date-fns';
import ITransfersRepository from '../../balances/repositories/ITransfersRepository';
import IUsersBalancesRepository from '../../balances/repositories/IUsersBalancesRepository';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

import IPlansDailyIncomesRepository from '../repositories/IPlansDailyIncomesRepository';

@injectable()
class ProcessDefaultPlanDailyIncomePaymentsService {
  constructor(
    @inject('PlansDailyIncomesRepository')
    private plansDailyIncomesRepository: IPlansDailyIncomesRepository,

    @inject('UsersBalancesRepository')
    private usersBalancesRepository: IUsersBalancesRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(): Promise<string> {
    const yesterday = subDays(new Date(), 1);
    const day = yesterday.getDate();
    const month = yesterday.getMonth();
    const year = yesterday.getFullYear();

    const yesterdayIncome = await this.plansDailyIncomesRepository.findByDay(
      day,
      month,
      year,
    );

    if (!yesterdayIncome) return 'dia sem rendimento';

    if (yesterdayIncome.applied) return 'rendimento ja aplicado';

    if (Number(yesterdayIncome.value) <= 0.0) {
      yesterdayIncome.applied = true;
      await this.plansDailyIncomesRepository.save(yesterdayIncome);

      const key = `applied_daily_incomes`;
      await this.cacheProvider.invalidate(key);

      return 'success';
    }

    const appliedBalances = await this.usersBalancesRepository.findAllByCard(
      'applied',
    );
    const appliedBalancesGreaterThanZero = appliedBalances.filter(b =>
      new BigNumber(b.usd_cents).isGreaterThan(0),
    );

    const description = `Daily Income - ${format(yesterday, 'dd/MM/yyyy')}`;

    await Promise.all(
      appliedBalancesGreaterThanZero.map(balance =>
        this.transfersRepository.create({
          card: 'income',
          description,
          usd_cents: new BigNumber(balance.usd_cents)
            .multipliedBy(yesterdayIncome.value)
            .toNumber(),
          user_id: balance.user_id,
        }),
      ),
    );

    yesterdayIncome.applied = true;
    await this.plansDailyIncomesRepository.save(yesterdayIncome);

    const key = `applied_daily_incomes`;
    await this.cacheProvider.invalidate(key);

    return 'success';
  }
}
export default ProcessDefaultPlanDailyIncomePaymentsService;
